// Final module screenshots → docs/creative/final (server must be running on BASE_URL).
const { chromium } = require("playwright");
const OUT = __dirname + "/../docs/creative/final/";
const BASE = process.env.BASE_URL || "http://localhost:3100";
const DESKTOP = [
  ["d01-home", "/"], ["d02-explore-gallery", "/explore"], ["d03-explore-index", "/explore", async (p) => p.click("button:has-text('Index')")],
  ["d04-creator-profile", "/creators/shreya-iyer"], ["d05-creator-passport", "/creators/shreya-iyer/passport"], ["d06-passport-badges", "/creators/shreya-iyer/passport", async (p) => p.evaluate(() => scrollTo(0, 820))],
  ["d07-booking", "/book/ananya-rao?service=s2"], ["d08-booking-confirmation", "/bookings/BK-1001?new=1"],
  ["d09-pitch-deck", "/pitch/new", async (p) => { await p.fill("#pn", "Kosha Rose Hydrating Mist"); await p.fill("#tl", "Alcohol-free rose mist for humid Indian summers"); await p.selectOption("#cat", "Beauty & Personal Care"); await p.click("button:has-text('Launched')"); await p.fill("#pr", "₹399 – ₹549"); }],
  ["d10-pitch-detail", "/pitch/PT-201"], ["d11-collaborate", "/collaborate"], ["d12-brief", "/collaborate/cb1"],
  ["d13-community", "/community"], ["d14-community-cards", "/community", async (p) => p.evaluate(() => scrollTo(0, 560))], ["d15-community-detail", "/community/hyderabad-foodies"],
  ["d16-regional", "/regional"], ["d17-regional-events", "/regional", async (p) => p.evaluate(() => { const el = document.getElementById("events"); scrollTo(0, el.getBoundingClientRect().top + scrollY - 100); })],
  ["d18-event", "/regional/events/ev1"], ["d19-duos", "/duos"], ["d20-duo-detail", "/duos/hyderabad-on-a-plate"],
  ["d21-user-dashboard", "/dashboard"], ["d22-creator-dashboard", "/creator", async (p) => { await p.click("text=Switch to Creator"); await p.waitForURL(/\/creator/); }],
  ["d23-creator-appearance", "/creator?tab=profile"],
  ["d24-admin", "/admin", async (p) => { await p.click("text=Switch to Admin"); await p.waitForURL(/\/admin/); await p.goto(p.url().split("?")[0]); }],
];
const TABLET = [["t1-home", "/"], ["t2-explore", "/explore"], ["t3-passport", "/creators/shreya-iyer/passport"], ["t4-regional", "/regional"], ["t5-creator-dashboard", "/creator"]];
const MOBILE = [["m1-home", "/"], ["m2-explore", "/explore"], ["m3-passport", "/creators/shreya-iyer/passport"], ["m4-booking", "/book/ananya-rao?service=s2"], ["m5-community", "/community"], ["m6-duos", "/duos"], ["m7-dashboard", "/dashboard"]];
async function run(ctxOpts, list, b) {
  const p = await (await b.newContext(ctxOpts)).newPage();
  for (const [name, path, act] of list) {
    await p.goto(BASE + path); await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await p.waitForTimeout(1300);
    if (act) { await act(p); await p.waitForTimeout(900); }
    await p.screenshot({ path: OUT + name + ".jpg", type: "jpeg", quality: 78 });
  }
}
(async () => {
  const b = await chromium.launch();
  // Show the creator dashboard as the creator (role switcher), everything else as the demo user.
  await run({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, DESKTOP, b);
  await run({ viewport: { width: 834, height: 1112 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, TABLET, b);
  await run({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, MOBILE, b);
  await b.close();
  console.log("saved to docs/creative/final");
})();
