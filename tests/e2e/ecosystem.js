const { chromium } = require("playwright");
const SHOTS = __dirname + "/.output/eco-";
require("fs").mkdirSync(__dirname + "/.output", { recursive: true });
const BASE = process.env.BASE_URL || "http://localhost:3100";
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text()));
  page.on("dialog", (d) => d.accept());
  const step = (s) => console.log("✓", s);
  const switchTo = async (label) => { await page.click("button[aria-haspopup=menu]"); await page.click(`role=menuitem[name=/${label}/]`); await page.waitForTimeout(300); };

  // NAV dropdowns
  await page.goto(BASE + "/");
  await page.screenshot({ path: SHOTS + "00-landing.png", fullPage: true });
  await page.hover("nav[aria-label=Main] >> text=Connect");
  await page.click("nav[aria-label=Main] >> text=Creator Duos");
  await page.waitForURL(/\/duos$/);
  await page.hover("nav[aria-label=Main] >> text=Community");
  await page.screenshot({ path: SHOTS + "01-nav-dropdown.png" });
  await page.click("nav[aria-label=Main] >> text=Regional Events");
  await page.waitForURL(/\/regional/);
  await page.click("nav[aria-label=Main] >> text=Collaborate");
  await page.waitForURL(/\/collaborate$/);
  step("nav dropdowns + links");

  // PASSPORT
  await page.goto(BASE + "/explore");
  await page.locator("a[href='/creators/shreya-iyer/passport']").click();
  await page.waitForSelector("text=RTG Creator Passport");
  await page.waitForSelector("text=No KYC or identity-verification provider is integrated");
  await page.waitForSelector("text=Hyderabad Pilot Creator");
  await page.screenshot({ path: SHOTS + "02-passport.png", fullPage: true });
  await page.locator("a[href^='/book/shreya-iyer?service=s1']").click();
  await page.waitForURL(/\/book\/shreya-iyer/);
  await page.goto(BASE + "/creators/ananya-rao");
  await page.click("text=View Creator Passport");
  await page.waitForURL(/ananya-rao\/passport/);
  step("creator passport (card + profile entry points, book link)");

  // COMMUNITY
  await page.goto(BASE + "/community");
  const card = page.locator("div.group", { hasText: "Travel Explorers" });
  const before = await card.locator("text=/members/").first().innerText();
  await card.locator("button:has-text('Join community')").click();
  await page.waitForSelector("text=Joined Travel Explorers");
  const after = await card.locator("text=/members/").first().innerText();
  if (before === after) throw new Error("member count did not change");
  await page.screenshot({ path: SHOTS + "03-community.png", fullPage: true });
  await page.click("text=My communities");
  if (await page.locator("section[aria-label='Community list'] >> text=Gaming Zone").count()) throw new Error("my communities filter failed");
  await page.goto(BASE + "/community/gaming-zone");
  await page.waitForSelector("text=Join Gaming Zone to read all discussions");
  await page.locator("button:has-text('Join community')").first().click();
  await page.waitForSelector("text=Posting and replies are planned for a later phase");
  await page.screenshot({ path: SHOTS + "04-community-detail.png", fullPage: true });
  await page.locator("button[aria-label='Leave Gaming Zone']").first().click();
  await page.waitForSelector("text=You left Gaming Zone");
  await page.locator("aside a[href='/creators/arnav-kulkarni']").first().click();
  await page.waitForURL(/arnav-kulkarni$/);
  step(`community join/leave (${before} → ${after}), detail, host link`);

  // REGIONAL
  await page.goto(BASE + "/regional");
  await page.waitForSelector("text=Creators and experiences in Hyderabad");
  await page.screenshot({ path: SHOTS + "05-regional.png", fullPage: true });
  await page.click("button:has-text('Food walks')");
  await page.waitForSelector("text=Upcoming in Hyderabad · Food walk");
  const n = await page.locator("#events ~ div a[href^='/regional/events/']").count();
  await page.selectOption("#city", "Chennai");
  await page.waitForSelector("text=No events in Chennai yet");
  await page.click("button:has-text('Explore Hyderabad')");
  await page.waitForSelector("text=Creators and experiences in Hyderabad");
  await page.goto(BASE + "/regional/events/ev8");
  await page.click("button:has-text('Register for free')");
  await page.waitForSelector("text=You're registered");
  await page.goto(BASE + "/regional/events/ev1");
  await page.click("button:has-text('Register ·')");
  await page.click("button:has-text('(simulated)')");
  await page.waitForSelector("text=Ticket confirmed");
  await page.waitForSelector("text=/Paid · sim_pay_/");
  await page.screenshot({ path: SHOTS + "06-event.png", fullPage: true });
  await page.goto(BASE + "/regional/events/ev6");
  await page.click("button:has-text('Join waitlist')");
  await page.waitForSelector("text=Added to waitlist (demo)");
  await page.goto(BASE + "/dashboard");
  await page.waitForSelector("text=Old City Biryani & Chai Food Walk");
  await page.waitForSelector("text=Travel Explorers");
  step(`regional filters (${n} food walks), city switch empty state, free + paid registration, waitlist, dashboard`);

  // DUOS
  await page.goto(BASE + "/duos");
  await page.click("text=Finance + Career");
  await page.click("text=Money Moves for Your First Job");
  await page.waitForURL(/money-moves-first-job$/);
  await page.screenshot({ path: SHOTS + "07-duo.png", fullPage: true });
  await page.click("text=Request booking");
  await page.click("text=Continue to pay");
  await page.waitForSelector("text=Select a date and time");
  await page.locator("button[aria-pressed]:not([disabled])", { hasText: /AM|PM/ }).first().click();
  await page.fill("#dt", "Negotiating my first offer and planning taxes");
  await page.check("input[type=checkbox]");
  await page.click("text=Continue to pay");
  await page.click("button:has-text('(simulated)')");
  await page.waitForURL(/\/bookings\/BK-/, { timeout: 10000 });
  const duoBk = page.url().match(/BK-\d+/)[0];
  await page.waitForSelector("text=Creator Duo booking — either creator can confirm");
  await page.screenshot({ path: SHOTS + "08-duo-confirm.png", fullPage: true });
  await page.click("text=Open as creator");
  await page.waitForURL(/creator\?tab=bookings/);
  const dc = page.locator("div.rounded-2xl", { hasText: duoBk }).last();
  await dc.locator("text=Duo with Nisha Bhatt").waitFor();
  await dc.locator("button:has-text('Accept')").click();
  await page.waitForSelector("text=Booking confirmed");
  await switchTo("Nisha Bhatt");
  await page.goto(BASE + "/creator?tab=bookings");
  await page.click("role=tab[name=/Upcoming/]");
  await page.locator("div.rounded-2xl", { hasText: duoBk }).last().locator("text=Duo with Priya Deshpande").waitFor();
  step("creator duo booking → lead accepts → partner sees it " + duoBk);

  // COLLABORATE: user posts brief
  await switchTo("User");
  await page.goto(BASE + "/collaborate/new");
  await page.click("text=Publish brief");
  await page.waitForSelector("text=Choose a category");
  await page.fill("#b-title", "Rose mist launch — creator partners");
  await page.fill("#b-sum", "Honest reviews of our new rose mist");
  await page.fill("#b-desc", "We are launching an alcohol-free rose mist and want creators to test it for two weeks before sharing.");
  await page.selectOption("#b-cat", "Beauty & Personal Care");
  await page.click("button:has-text('Product launch')");
  await page.click("button:has-text('Chennai')");
  await page.locator("input[placeholder='e.g. Skincare content focus']").fill("Skincare audience");
  await page.click("button[aria-label='Add Requirements']");
  await page.locator("input[placeholder='e.g. 1 reel + 3 stories']").fill("1 reel and 2 stories");
  await page.click("button[aria-label='Add Deliverables']");
  await page.click("text=Publish brief");
  await page.waitForURL(/\/collaborate\/cb\d+/);
  const briefUrl = page.url();
  await page.waitForSelector("text=No applications yet");
  step("brief validation + publish");

  // creator applies (Meera, Chennai)
  await switchTo("Meera Krishnan");
  await page.goto(briefUrl);
  await page.click("text=Submit application");
  await page.waitForSelector("text=/at least 40 characters/");
  await page.fill("#am", "My audience trusts my skincare reviews and I always test products for two weeks before posting.");
  await page.fill("#af", "25000");
  await page.fill("#al", "instagram.com/meera.everyday");
  await page.click("text=Submit application");
  await page.waitForSelector("text=Your application");
  await page.screenshot({ path: SHOTS + "09-collab-applied.png", fullPage: true });
  step("creator applies with validation");

  // brand shortlists + accepts
  await switchTo("User");
  await page.goto(briefUrl);
  await page.click("button:has-text('Shortlist')");
  await page.waitForSelector("text=Creator shortlisted");
  await page.click("main button:has-text('Accept')");
  await page.waitForSelector("text=Creator accepted");
  await page.screenshot({ path: SHOTS + "10-collab-owner.png", fullPage: true });
  await switchTo("Meera Krishnan");
  await page.goto(BASE + "/creator?tab=collabs");
  await page.waitForSelector("text=Rose mist launch — creator partners");
  await page.locator("li", { hasText: "Rose mist launch" }).locator("text=Accepted").first().waitFor();
  await page.screenshot({ path: SHOTS + "11-creator-collabs.png", fullPage: true });
  step("brand shortlist → accept → creator dashboard status");

  // Admin ecosystem
  await switchTo("Admin");
  await page.goto(BASE + "/admin?tab=ecosystem");
  await page.waitForSelector("text=Brand collaborations");
  await page.waitForSelector("text=Rose mist launch — creator partners");
  await page.screenshot({ path: SHOTS + "12-admin-eco.png", fullPage: true });
  step("admin ecosystem tab");

  // Broken link crawl
  await switchTo("User");
  const pages = ["/", "/explore", "/community", "/community/hyderabad-foodies", "/regional", "/regional/events/ev3", "/duos", "/duos/hyderabad-on-a-plate", "/collaborate", "/collaborate/cb1", "/creators/shreya-iyer", "/creators/shreya-iyer/passport", "/dashboard", "/creator", "/admin", "/pitch"];
  const hrefs = new Set();
  for (const p of pages) {
    await page.goto(BASE + p); await page.waitForTimeout(200);
    for (const h of await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")))) hrefs.add(h.split("#")[0]);
  }
  const broken = [];
  for (const h of hrefs) {
    await page.goto(BASE + h); await page.waitForTimeout(150);
    if (await page.locator("text=We couldn't find that page").count()) broken.push(h);
  }
  console.log(`✓ crawled ${hrefs.size} internal links, broken: ${broken.length ? broken.join(", ") : "none"}`);

  // Mobile
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const mp = await m.newPage();
  mp.on("pageerror", (e) => errors.push("mobile pageerror: " + e.message));
  for (const p of ["/community", "/community/startup-founders", "/regional", "/regional/events/ev1", "/duos", "/duos/hyderabad-on-a-plate", "/duos/hyderabad-on-a-plate/book", "/collaborate", "/collaborate/cb1", "/collaborate/new", "/creators/kavya-reddy/passport", "/creator?tab=collabs", "/admin?tab=ecosystem", "/dashboard"]) {
    await mp.goto(BASE + p); await mp.waitForTimeout(300);
    const bad = await mp.evaluate(() => [...document.querySelectorAll("main *")].filter((e) => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && !e.closest(".overflow-x-auto,.overflow-hidden,[class*=scrollbar-none]"); }).map((e) => e.tagName + "." + (e.className || "").toString().slice(0, 40)).slice(0, 3));
    if (bad.length) errors.push(`mobile overflow ${p}: ${bad.join(" | ")}`);
    await mp.screenshot({ path: SHOTS + "m" + p.replace(/[/?=]/g, "_") + ".png" });
  }
  await mp.goto(BASE + "/"); await mp.click("button[aria-label='Open menu']"); await mp.waitForSelector("nav[aria-label=Mobile] >> text=Creator Duos");
  await mp.screenshot({ path: SHOTS + "m-menu.png" });
  step("mobile pages + grouped mobile menu");

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "No console/page errors");
  await browser.close();
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
