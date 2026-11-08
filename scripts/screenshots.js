// Captures the redesign screenshot set into docs/redesign/screenshots (server must be running).
// Usage: BASE_URL=http://localhost:3100 node scripts/screenshots.js
const { chromium } = require("playwright");
const OUT = __dirname + "/../docs/redesign/screenshots/";
const BASE = process.env.BASE_URL || "http://localhost:3100";
const DESKTOP = [
  ["01-home-hero", "/", 0], ["02-home-featured", "/", "Practitioners, not"], ["03-home-pitch", "/", "Structured feedback"], ["04-home-community", "/", "Meet the people"],
  ["05-explore", "/explore", 0], ["06-creator-profile", "/creators/shreya-iyer", 0], ["07-creator-passport", "/creators/shreya-iyer/passport", 0],
  ["08-booking", "/book/ananya-rao?service=s2", 0], ["09-pitch", "/pitch/new", 0], ["10-community", "/community", 0],
  ["11-regional", "/regional", 0], ["12-event", "/regional/events/ev1", 0], ["13-duo", "/duos/hyderabad-on-a-plate", 0],
  ["14-collaborate", "/collaborate", 0], ["15-user-dashboard", "/dashboard", 0], ["16-creator-dashboard", "/creator", 0], ["17-admin", "/admin", 0],
];
const MOBILE = [["m1-home", "/"], ["m2-explore", "/explore"], ["m3-passport", "/creators/shreya-iyer/passport"], ["m4-duos", "/duos"], ["m5-creator-dashboard", "/creator"]];
(async () => {
  const b = await chromium.launch();
  const d = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  for (const [name, path, y] of DESKTOP) {
    await d.goto(BASE + path); await d.waitForTimeout(500);
    const h = await d.evaluate(() => document.body.scrollHeight);
    for (let s = 0; s < h; s += 450) { await d.evaluate((s) => scrollTo(0, s), s); await d.waitForTimeout(30); }
    if (typeof y === "string") {
      await d.evaluate((t) => { const el = [...document.querySelectorAll("h2")].find((x) => x.textContent.includes(t)); const top = el.getBoundingClientRect().top + scrollY; scrollTo(0, top - 150); }, y);
    } else await d.evaluate((y) => scrollTo(0, y), y);
    await d.waitForTimeout(900);
    await d.screenshot({ path: OUT + name + ".jpg", type: "jpeg", quality: 82 });
  }
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  for (const [name, path] of MOBILE) { await m.goto(BASE + path); await m.waitForTimeout(900); await m.screenshot({ path: OUT + name + ".jpg", type: "jpeg", quality: 82 }); }
  await m.goto(BASE + "/"); await m.click("button[aria-label='Open menu']"); await m.waitForTimeout(600);
  await m.screenshot({ path: OUT + "m6-menu.jpg", type: "jpeg", quality: 82 });
  await b.close();
  console.log("saved to docs/redesign/screenshots");
})();
