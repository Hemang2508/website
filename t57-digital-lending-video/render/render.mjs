#!/usr/bin/env node
/* ==========================================================================
   MP4 renderer: headless Chromium (Playwright) captures each frame, then
   FFmpeg encodes H.264 (yuv420p, no audio track).

   Usage (run from the project folder):
     node render/render.mjs                          # 30 fps, full video
     node render/render.mjs --fps 60 --workers 4
     node render/render.mjs --from 30 --to 50 --out output/clip.mp4
     node render/render.mjs --stills 3,20,45         # PNG stills for review
     node render/render.mjs --timings '[{"id":"cost","duration":22}]'
   ========================================================================== */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]);
  return acc;
}, []));
const FPS = +(args.fps || 30);
const WORKERS = +(args.workers || 4);
const OUT = resolve(ROOT, args.out || "output/T57-digital-lending-safeguards.mp4");
const CRF = +(args.crf || 16);

const url = new URL(pathToFileURL(join(ROOT, "index.html")));
url.searchParams.set("render", "1");
if (args.timings) url.searchParams.set("timings", args.timings);

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error("[page error]", e.message));
  await page.goto(url.href);
  await page.waitForFunction(() => window.__ready === true);
  return page;
}

async function stills(browser, times) {
  const page = await openPage(browser);
  const dir = resolve(ROOT, "output/stills");
  mkdirSync(dir, { recursive: true });
  for (const t of times) {
    await page.evaluate((t) => window.__seek(t), t);
    const file = join(dir, `still-${String(t).replace(".", "_")}s.png`);
    await page.screenshot({ path: file });
    console.log("wrote", file);
  }
}

function encoder(file) {
  const ff = spawn("ffmpeg", [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
    "-an", "-c:v", "libx264", "-preset", "slow", "-crf", String(CRF), "-tune", "animation",
    "-pix_fmt", "yuv420p", "-r", String(FPS),
    "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
    file,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg exited " + c)))));
  return { ff, done };
}

async function renderSegment(browser, idx, f0, f1, tmpDir, progress) {
  const page = await openPage(browser);
  const file = join(tmpDir, `seg-${String(idx).padStart(3, "0")}.mp4`);
  const { ff, done } = encoder(file);
  for (let f = f0; f < f1; f++) {
    await page.evaluate((t) => window.__seek(t), f / FPS);
    const buf = await page.screenshot({ type: "png" });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    progress();
  }
  ff.stdin.end();
  await done;
  await page.close();
  return file;
}

const browser = await chromium.launch();
try {
  if (args.stills) {
    await stills(browser, String(args.stills).split(",").map(Number));
  } else {
    const probe = await openPage(browser);
    const total = await probe.evaluate(() => window.__total);
    await probe.close();
    const from = +(args.from || 0), to = Math.min(+(args.to || total), total);
    const F0 = Math.round(from * FPS), F1 = Math.round(to * FPS);
    const n = F1 - F0;
    console.log(`Rendering ${(n / FPS).toFixed(2)} s (${n} frames @ ${FPS} fps) with ${WORKERS} workers → ${OUT}`);
    const tmpDir = resolve(ROOT, "output/.segments");
    rmSync(tmpDir, { recursive: true, force: true });
    mkdirSync(tmpDir, { recursive: true });
    mkdirSync(dirname(OUT), { recursive: true });
    let doneFrames = 0, lastLog = 0;
    const t0 = Date.now();
    const progress = () => {
      doneFrames++;
      if (Date.now() - lastLog > 5000) {
        lastLog = Date.now();
        const rate = doneFrames / ((Date.now() - t0) / 1000);
        console.log(`  ${doneFrames}/${n} frames · ${rate.toFixed(1)} fps · ETA ${((n - doneFrames) / rate).toFixed(0)} s`);
      }
    };
    const per = Math.ceil(n / WORKERS);
    const jobs = [];
    for (let w = 0; w < WORKERS; w++) {
      const a = F0 + w * per, b = Math.min(F1, a + per);
      if (a < b) jobs.push(renderSegment(browser, w, a, b, tmpDir, progress));
    }
    const files = await Promise.all(jobs);
    const list = join(tmpDir, "list.txt");
    writeFileSync(list, files.map((f) => `file '${f}'`).join("\n"));
    await new Promise((res, rej) => spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", "-an", "-movflags", "+faststart", OUT], { stdio: "inherit" })
      .on("close", (c) => (c === 0 ? res() : rej(new Error("concat failed")))));
    rmSync(tmpDir, { recursive: true, force: true });
    console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(0)} s → ${OUT}`);
  }
} finally {
  await browser.close();
}
if (!existsSync(OUT) && !args.stills) process.exit(1);
