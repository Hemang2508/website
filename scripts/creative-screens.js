// Stage 2 review screenshots of the creative homepage → docs/creative/stage2 (server must be running).
const { chromium } = require("playwright");
const OUT = __dirname + "/../docs/creative/stage2/";
const BASE = process.env.BASE_URL || "http://localhost:3100";
const shot = (p, n) => p.screenshot({ path: OUT + n + ".jpg", type: "jpeg", quality: 84 });
const toHeading = (p, t, off = 110) => p.evaluate(([t, off]) => { const el = [...document.querySelectorAll("h2,h3")].find((x) => x.textContent.includes(t)); scrollTo(0, el.getBoundingClientRect().top + scrollY - off); }, [t, off]);
(async () => {
  const b = await chromium.launch();
  const d = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await d.goto(BASE + "/"); await d.addStyleTag({ content: "html{scroll-behavior:auto!important}" }); await d.waitForTimeout(2400); await shot(d, "01-hero");
  await d.hover("a[aria-label^='Shreya Iyer']"); await d.waitForTimeout(500); await shot(d, "02-hero-profile-preview");
  await d.mouse.move(10, 10);
  const h = await d.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 400) { await d.evaluate((y) => scrollTo(0, y), y); await d.waitForTimeout(30); }
  await toHeading(d, "Why RTG Live", 400).catch(() => {});
  await d.evaluate(() => { const el = [...document.querySelectorAll("p")].find((x) => x.textContent.startsWith("Every creator")); scrollTo(0, el.getBoundingClientRect().top + scrollY - 380); }); await d.waitForTimeout(500); await shot(d, "03-manifesto-mid-scroll");
  await d.evaluate(() => { const s = document.getElementById("creators"); scrollTo(0, s.getBoundingClientRect().top + scrollY + 10); }); await d.waitForTimeout(600); await shot(d, "04-creator-universe-start");
  await d.evaluate(() => { const s = document.getElementById("creators"); scrollTo(0, s.getBoundingClientRect().top + scrollY + (s.offsetHeight - innerHeight) * 0.7); }); await d.waitForTimeout(600); await shot(d, "05-creator-universe-scrolled");
  for (const [id, n] of [["connect", "06-chapter-connect"], ["pitch", "07-chapter-pitch"], ["community", "08-chapter-community"], ["duos", "09-chapter-duos"], ["collaborate", "10-chapter-collaborate"]]) {
    await d.evaluate((id) => { const el = document.getElementById("ch-" + id); scrollTo(0, el.getBoundingClientRect().top + scrollY - 160); }, id); await d.waitForTimeout(1300); await shot(d, n);
  }
  await toHeading(d, "Hyderabad,"); await d.waitForTimeout(900); await shot(d, "11-hyderabad-map");
  await d.hover("button[aria-label^='Old City Biryani']"); await d.waitForTimeout(500); await shot(d, "12-hyderabad-map-pin");
  await toHeading(d, "Your expertise"); await d.waitForTimeout(900); await shot(d, "13-for-creators");
  await toHeading(d, "Your idea", 140); await d.waitForTimeout(900); await shot(d, "14-final-cta");
  await d.evaluate(() => scrollTo(0, document.body.scrollHeight)); await d.waitForTimeout(600); await shot(d, "15-footer");
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  await m.goto(BASE + "/"); await m.addStyleTag({ content: "html{scroll-behavior:auto!important}" }); await m.waitForTimeout(2400); await shot(m, "m1-hero");
  await m.evaluate(() => scrollTo(0, 820)); await m.waitForTimeout(700); await shot(m, "m2-hero-creators");
  await m.evaluate(() => { const s = document.getElementById("creators"); scrollTo(0, s.getBoundingClientRect().top + scrollY); }); await m.waitForTimeout(700); await shot(m, "m3-creator-universe-swipe");
  await m.evaluate(() => { const el = document.getElementById("ch-duos"); scrollTo(0, el.getBoundingClientRect().top + scrollY - 80); }); await m.waitForTimeout(900); await shot(m, "m4-chapter-duos");
  const r = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" })).newPage();
  await r.goto(BASE + "/"); await r.waitForTimeout(600); await shot(r, "rm-hero-reduced-motion");
  await b.close();
  console.log("saved to docs/creative/stage2");
})();
