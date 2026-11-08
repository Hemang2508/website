const { chromium } = require("playwright");
const SHOTS = __dirname + "/.output/";
require("fs").mkdirSync(SHOTS, { recursive: true });
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

  // Landing
  await page.goto(BASE + "/");
  await page.screenshot({ path: SHOTS + "01-landing.png", fullPage: true });
  await page.fill('input[placeholder^="Try"]', "pitch deck");
  await page.click("text=Find experts");
  await page.waitForURL(/explore\?q=pitch/);
  await page.waitForSelector("text=Vikram Sethi");
  step("landing search → explore");

  // Explore filters
  await page.goto(BASE + "/explore");
  const count0 = await page.locator("a[href^='/creators/']").count();
  await page.click("button[aria-pressed]:has-text('Finance & Investing')");
  const count1 = await page.locator("main a[href^='/creators/']").count();
  if (!(count1 < count0 && count1 > 0)) throw new Error(`filter failed ${count0} ${count1}`);
  await page.click("aside >> text=Clear all");
  await page.screenshot({ path: SHOTS + "02-explore.png" });
  step(`explore filters (${count0} → ${count1})`);

  // Journey A
  await page.click("a[href='/creators/ananya-rao']");
  await page.waitForSelector("h1:has-text('Ananya Rao')");
  await page.screenshot({ path: SHOTS + "03-profile.png", fullPage: true });
  await page.click("a[href*='/book/ananya-rao?service=s2']");
  await page.waitForSelector("text=Pick a date and time");
  await page.click("text=Continue");
  await page.waitForSelector("text=Select a date and time to continue");
  // pick first free time slot
  const slot = page.locator("button[aria-pressed]:not([disabled])", { hasText: /AM|PM/ }).first();
  await slot.click();
  await page.screenshot({ path: SHOTS + "04-book-slot.png" });
  await page.click("text=Continue");
  await page.click("text=Continue"); // trigger validation
  await page.waitForSelector("text=Describe what you'd like to discuss");
  await page.fill("#topic", "Positioning our new face oil for quick-commerce");
  await page.check("input[type=checkbox]");
  await page.click("text=Continue");
  await page.waitForSelector("text=Review & pay");
  await page.click("text=Proceed to pay");
  await page.waitForSelector("text=Secure checkout");
  await page.screenshot({ path: SHOTS + "05-payment.png" });
  await page.click("button:has-text('(simulated)')");
  await page.waitForURL(/\/bookings\/BK-/, { timeout: 10000 });
  await page.waitForSelector("text=Booking request sent");
  const bookingId = page.url().match(/BK-\d+/)[0];
  await page.screenshot({ path: SHOTS + "06-confirmation.png", fullPage: true });
  step("journey A booked " + bookingId);
  await page.goto(BASE + "/dashboard");
  await page.waitForSelector(`text=${bookingId}`);
  step("booking visible in user dashboard");

  // Journey C – creator
  await page.goto(BASE + "/bookings/" + bookingId);
  await page.click("text=Open as creator");
  await page.waitForURL(/creator\?tab=bookings/);
  const card = page.locator("div.rounded-2xl", { hasText: bookingId }).last();
  await card.locator("button:has-text('Accept')").click();
  await page.waitForSelector("text=Booking confirmed");
  step("creator accepted booking");
  await page.click("role=tab[name=/Services/]");
  const priceInput = page.locator("input[type=number]").first();
  await priceInput.fill("1799");
  await page.locator("button:has-text('Save changes')").first().click();
  await page.waitForSelector("text=Service updated");
  await priceInput.fill("50");
  await page.locator("button:has-text('Save changes')").first().click();
  await page.waitForSelector("text=Between ₹299");
  step("pricing update + validation");
  await page.click("role=tab[name=/Availability/]");
  await page.locator("td button").nth(3).click();
  await page.click("text=Save schedule");
  await page.waitForSelector("text=Availability saved");
  await page.click("role=tab[name=/Earnings/]");
  await page.waitForSelector("text=Earnings by source");
  await page.screenshot({ path: SHOTS + "07-creator-earnings.png", fullPage: true });
  await page.click("role=tab[name=/Overview/]");
  await page.screenshot({ path: SHOTS + "08-creator-overview.png", fullPage: true });
  step("creator availability + earnings");

  // check user sees confirmed
  await page.goto(BASE + "/bookings/" + bookingId);
  await page.waitForSelector("text=Confirmed");

  // Journey B – switch back to user via role switcher
  await page.click("button[aria-haspopup=menu]");
  await page.click("role=menuitem[name=/User/]");
  await page.waitForURL(/dashboard/);
  await page.goto(BASE + "/pitch/new");
  await page.click("text=Continue");
  await page.waitForSelector("text=Enter the product name");
  await page.fill("#pn", "Kosha Rose Hydrating Mist");
  await page.fill("#tl", "Alcohol-free rose mist for humid Indian summers");
  await page.fill("#desc", "A steam-distilled Kannauj rose water mist with aloe and niacinamide, made for daily refreshment in humid weather. We need feedback on price and packaging.");
  await page.selectOption("#cat", "Beauty & Personal Care");
  await page.fill("#pr", "₹399 – ₹549");
  await page.click("button:has-text('Launched')");
  await page.setInputFiles("input[type=file]", { name: "mist.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64") });
  await page.waitForSelector("img[alt='Product image 1']");
  await page.click("text=Continue");
  await page.click("text=Young professionals");
  await page.click("text=Pricing validation");
  await page.click("text=Continue");
  await page.waitForSelector("text=Recommended creators");
  await page.screenshot({ path: SHOTS + "09-pitch-match.png", fullPage: true });
  await page.locator("button[aria-pressed]", { hasText: "Ananya Rao" }).click();
  await page.locator("button[aria-pressed]", { hasText: "Meera Krishnan" }).click();
  await page.click("text=Continue");
  await page.waitForSelector("text=Review your pitch");
  await page.click("text=& send pitch");
  await page.click("button:has-text('(simulated)')");
  await page.waitForURL(/\/pitch\/PT-/, { timeout: 10000 });
  const pitchId = page.url().match(/PT-\d+/)[0];
  step("journey B pitch sent " + pitchId);
  await page.click("text=Open as creator");
  await page.waitForURL(/creator\?tab=pitches/);
  const pc = page.locator("div.rounded-2xl", { hasText: "Kosha Rose Hydrating Mist" }).last();
  await pc.locator("button:has-text('Accept')").click();
  await page.waitForSelector("text=Pitch accepted");
  await page.locator("div.rounded-2xl", { hasText: "Kosha Rose Hydrating Mist" }).last().locator("button:has-text('Submit feedback')").click();
  await page.click("button:has-text('Submit feedback') >> nth=-1");
  await page.waitForSelector("text=Score every criterion");
  for (const g of await page.locator("[role=radiogroup]").all()) await g.locator("button").nth(3).click();
  await page.fill("#fb-s", "Lovely fragrance and the packaging feels premium for the price.");
  await page.fill("#fb-i", "Clarify the niacinamide percentage and offer a 50 ml trial size.");
  await page.fill("#fb-a", "Strong fit for my urban audience.");
  await page.click("text=Iterate first");
  await page.screenshot({ path: SHOTS + "10-feedback-form.png" });
  await page.click("button:has-text('Submit feedback') >> nth=-1");
  await page.waitForSelector("text=Feedback submitted");
  step("creator accepted + submitted feedback");
  // decline the other pitch (BrewBox) to test decline
  await page.click("role=tab[name=/New requests/]");
  const bb = page.locator("div.rounded-2xl", { hasText: "BrewBox" }).last();
  await bb.locator("button:has-text('Decline')").click();
  await page.click("text=Outside my content focus");
  await page.click("role=dialog >> button:has-text('Decline pitch')");
  await page.waitForSelector("text=Pitch declined");
  step("creator declined pitch");

  // User sees feedback
  await page.click("button[aria-haspopup=menu]");
  await page.click("role=menuitem[name=/User/]");
  await page.goto(BASE + "/pitch/" + pitchId);
  await page.waitForSelector("text=Feedback summary");
  await page.screenshot({ path: SHOTS + "11-pitch-detail.png", fullPage: true });
  step("user sees pitch feedback");

  // Review flow: Vikram completed booking
  await page.goto(BASE + "/dashboard");
  await page.click("text=Leave a review");
  await page.click("[aria-label='5 stars']");
  await page.fill("#rv", "Sharp, honest feedback on our deck. Highly recommended.");
  await page.click("text=Publish review");
  await page.waitForSelector("text=Review published");
  await page.screenshot({ path: SHOTS + "12-user-dashboard.png", fullPage: true });
  step("review submitted");

  // Notifications
  await page.click("button[aria-label^='Notifications']");
  await page.waitForSelector("text=Mark all as read");
  await page.screenshot({ path: SHOTS + "13-notifications.png" });
  await page.keyboard.press("Escape");
  step("notifications");

  // Admin
  await page.click("button[aria-haspopup=menu]");
  await page.click("role=menuitem[name=/Admin/]");
  await page.waitForURL(/admin/);
  await page.screenshot({ path: SHOTS + "14-admin.png", fullPage: true });
  await page.click("role=tab[name=/Creators/]");
  await page.click("button:has-text('Approve')");
  await page.waitForSelector("text=Siddharth Rao approved");
  await page.click("role=tab[name=/Transactions/]");
  await page.selectOption("select[aria-label=Type]", "Product pitch");
  await page.screenshot({ path: SHOTS + "15-admin-tx.png" });
  step("admin approve + transactions");

  // Persistence after reload
  await page.reload();
  await page.goto(BASE + "/dashboard");
  await page.waitForSelector(`text=${bookingId}`);
  step("state persisted across reload");

  // Mobile
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const mp = await m.newPage();
  mp.on("pageerror", (e) => errors.push("mobile pageerror: " + e.message));
  for (const [path, name] of [["/", "m-landing"], ["/explore", "m-explore"], ["/creators/ananya-rao", "m-profile"], ["/book/ananya-rao?service=s1", "m-book"], ["/creator", "m-creator"], ["/admin", "m-admin"], ["/pitch/new", "m-pitch"], ["/dashboard", "m-dashboard"]]) {
    await mp.goto(BASE + path);
    await mp.waitForTimeout(300);
    const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) errors.push(`horizontal overflow on ${path}: ${overflow}px`);
    await mp.screenshot({ path: SHOTS + name + ".png", fullPage: path === "/" });
  }
  await mp.goto(BASE + "/");
  await mp.click("button[aria-label='Open menu']");
  await mp.waitForSelector("nav[aria-label=Mobile]");
  await mp.screenshot({ path: SHOTS + "m-menu.png" });
  await mp.goto(BASE + "/explore");
  await mp.click("button:has-text('Filters')");
  await mp.waitForSelector("role=dialog[name=Filters]");
  await mp.screenshot({ path: SHOTS + "m-filters.png" });
  step("mobile pages + menu + filters");

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "No console/page errors");
  await browser.close();
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
