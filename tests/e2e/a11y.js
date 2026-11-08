// Accessibility audit: axe-core (WCAG 2.1 A + AA rules) on key routes at desktop and mobile.
// Fails on any "serious" or "critical" violation. Also checks keyboard reachability of the
// primary navigation and that a visible focus indicator is drawn.
const { chromium } = require("playwright");
const path = require("path");
const BASE = process.env.BASE_URL || "http://localhost:3100";
const AXE = path.join(__dirname, "../../node_modules/axe-core/axe.min.js");
const ROUTES = ["/", "/explore", "/creators/shreya-iyer", "/creators/shreya-iyer/passport", "/book/ananya-rao?service=s2", "/pitch/new", "/pitch/PT-201",
  "/community", "/community/gaming-zone", "/regional", "/regional/events/ev1", "/duos", "/duos/hyderabad-on-a-plate", "/collaborate", "/collaborate/cb1",
  "/dashboard", "/creator", "/creator?tab=profile", "/admin"];
(async () => {
  const browser = await chromium.launch();
  const problems = [];
  for (const [w, label] of [[1280, "desktop"], [390, "mobile"]]) {
    const page = await (await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 600, reducedMotion: "reduce" })).newPage();
    for (const r of ROUTES) {
      await page.goto(BASE + r);
      await page.waitForTimeout(400);
      await page.addScriptTag({ path: AXE });
      const res = await page.evaluate(async () => {
        // eslint-disable-next-line no-undef
        const out = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }, resultTypes: ["violations"] });
        return out.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes[0].target.join(" ")}`);
      });
      res.forEach((v) => problems.push(`${label} ${r}: ${v}`));
    }
  }
  // Keyboard: tab from the top reaches the skip link, then the main navigation, with a visible focus ring.
  const kb = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await kb.goto(BASE + "/explore"); await kb.waitForTimeout(300);
  await kb.keyboard.press("Tab");
  const first = await kb.evaluate(() => document.activeElement?.textContent?.trim());
  if (first !== "Skip to content") problems.push(`keyboard: first tab stop is "${first}", expected skip link`);
  let reachedNav = false, ring = false;
  for (let i = 0; i < 12; i++) {
    await kb.keyboard.press("Tab");
    const info = await kb.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); return { inNav: !!el.closest("nav[aria-label=Main]"), outline: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0, shadow: cs.boxShadow !== "none" }; });
    if (info.inNav) { reachedNav = true; ring = ring || info.outline || info.shadow; }
  }
  if (!reachedNav) problems.push("keyboard: main navigation not reachable by Tab");
  if (!ring) problems.push("keyboard: no visible focus indicator on navigation links");
  console.log(`✓ axe WCAG 2.1 AA on ${ROUTES.length} routes × 2 viewports + keyboard navigation`);
  console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "No serious/critical accessibility violations");
  await browser.close();
  if (problems.length) process.exit(1);
})();
