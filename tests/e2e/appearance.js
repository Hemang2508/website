// Creator appearance: choose figure attributes, save, verify on profile; upload a photo that
// overrides the figure; revert to the figure. Also verifies the default figure is neutral.
const { chromium } = require("playwright");
const BASE = process.env.BASE_URL || "http://localhost:3100";
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAG0lEQVR42mNkYPj/n4EIwDiqkL4KGUYVMgAAOJcH/fMFj0AAAAAASUVORK5CYII=", "base64");
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const step = (s) => console.log("✓", s);

  // Default: no personal attributes are inferred — the figure shows no hair/headwear/accessory.
  await p.goto(BASE + "/creators/farhan-qureshi"); await p.waitForTimeout(400);
  const defaultParts = await p.evaluate(() => document.querySelector("svg[aria-label^='Illustration of Farhan']").querySelectorAll("g[transform] > path").length);
  if (defaultParts !== 1) throw new Error(`default figure should only have shoulders path, found ${defaultParts} paths`);
  step("default figure is neutral (nothing inferred from name/ID)");

  await p.click("button[aria-haspopup=menu]");
  await p.click("role=menuitem[name=/Ananya Rao/]");
  await p.goto(BASE + "/creator?tab=profile");
  await p.waitForSelector("text=How you appear");
  await p.click("role=radio[name='Curly']");
  await p.click("role=radio[name='Glasses']");
  await p.click("role=radio[name='Tone 4']");
  await p.click("text=Save appearance");
  await p.waitForSelector("text=Appearance saved");
  await p.goto(BASE + "/creators/ananya-rao"); await p.waitForTimeout(300);
  const parts = await p.evaluate(() => document.querySelector("svg[aria-label^='Illustration of Ananya']").querySelectorAll("g[transform] path, g[transform] circle").length);
  if (parts < 4) throw new Error("chosen hair/glasses not rendered on profile");
  step("creator chose hair, glasses and tone; profile shows the figure");

  await p.goto(BASE + "/creator?tab=profile");
  await p.setInputFiles("input[aria-label='Upload profile photo']", { name: "me.png", mimeType: "image/png", buffer: PNG });
  await p.waitForSelector("text=Your photo is shown on your profile.");
  await p.click("text=Save appearance");
  await p.goto(BASE + "/explore"); await p.waitForTimeout(300);
  const photos = await p.locator("img[alt='Ananya Rao']").count();
  if (!photos) throw new Error("uploaded photo not used on explore card");
  step("uploaded photo replaces the figure across the site");

  await p.goto(BASE + "/creator?tab=profile");
  await p.click("text=Use figure");
  await p.click("text=Save appearance");
  await p.goto(BASE + "/creators/ananya-rao"); await p.waitForTimeout(300);
  if (!(await p.locator("svg[aria-label^='Illustration of Ananya']").count())) throw new Error("did not fall back to figure");
  step("removing the photo falls back to the chosen figure");

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "No console/page errors");
  await b.close();
  if (errors.length) process.exit(1);
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
