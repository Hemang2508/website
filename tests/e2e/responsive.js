// Responsive + reduced-motion regression: every route at phone, tablet and laptop widths.
// Fails if any element that renders text extends past the viewport (clipped content),
// or if the page itself scrolls horizontally.
const { chromium } = require("playwright");
const BASE = process.env.BASE_URL || "http://localhost:3100";
const ROUTES = [
  "/", "/explore", "/creators/ananya-rao", "/creators/shreya-iyer/passport", "/book/ananya-rao?service=s2", "/bookings/BK-1001",
  "/pitch/new", "/pitch", "/pitch/PT-201", "/community", "/community/hyderabad-foodies", "/regional", "/regional/events/ev1",
  "/duos", "/duos/hyderabad-on-a-plate", "/duos/hyderabad-on-a-plate/book", "/collaborate", "/collaborate/cb1", "/collaborate/new",
  "/dashboard", "/creator", "/creator?tab=earnings", "/creator?tab=collabs", "/admin", "/admin?tab=transactions", "/admin?tab=ecosystem",
];
const WIDTHS = [390, 768, 1280];
(async () => {
  const browser = await chromium.launch();
  const problems = [];
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => problems.push(`${w}px pageerror: ${e.message}`));
    for (const r of ROUTES) {
      await page.goto(BASE + r);
      await page.waitForTimeout(250);
      const res = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const scroll = document.documentElement.scrollWidth - vw;
        const clipped = [];
        for (const el of document.querySelectorAll("body *")) {
          // Excluded: native scroll rows, intentional carousels (content slides into view), dialogs, decorative layers.
          if (el.closest(".overflow-x-auto,.scrollbar-none,[data-carousel],[role=dialog],[aria-hidden=true]")) continue;
          const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (!hasText) continue;
          const rc = el.getBoundingClientRect();
          if (rc.width && (rc.right > vw + 1 || rc.left < -1)) clipped.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}"`);
        }
        return { scroll, clipped: clipped.slice(0, 3) };
      });
      if (res.scroll > 1) problems.push(`${w}px ${r}: page scrolls horizontally by ${res.scroll}px`);
      if (res.clipped.length) problems.push(`${w}px ${r}: clipped text → ${res.clipped.join(" | ")}`);
    }
    await ctx.close();
  }
  // Reduced motion: reveals and entrance animations must leave content fully visible.
  const rm = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const p = await rm.newPage();
  await p.goto(BASE + "/");
  await p.waitForTimeout(300);
  const hidden = await p.evaluate(() => [...document.querySelectorAll(".reveal-hide")].length + [...document.querySelectorAll("h1,h2")].filter((h) => +getComputedStyle(h).opacity < 0.99).length);
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(200);
  const anim = await p.evaluate(() => getComputedStyle(document.querySelector("h1")).animationDuration);
  if (hidden) problems.push(`reduced motion: ${hidden} element(s) hidden`);
  if (!/^0\.0+1ms|^1e-05s|^0s/.test(anim)) problems.push(`reduced motion: hero animation still ${anim}`);
  console.log(`✓ checked ${ROUTES.length} routes × ${WIDTHS.length} widths + reduced motion`);
  console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "No overflow, clipping or reduced-motion problems");
  await browser.close();
  if (problems.length) process.exit(1);
})();
