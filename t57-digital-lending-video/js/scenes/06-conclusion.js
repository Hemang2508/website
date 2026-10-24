/* SCENE 6: CONCLUSION
   Three takeaways appear one after another, then the closing line. */
(function () {
  const { reveal, prog, lerp, Ease } = Anim;

  const K = { kicker: 0.3, rows: [0.9, 2.3, 3.7], settle: 6.0, final: 6.6, underline: 8.0 };
  const ROWS = ["VERIFY THE LENDER.", "UNDERSTAND THE COST.", "PROTECT YOUR DATA."];

  Scene.define("conclusion", {
    title: "Conclusion",
    base: 13,
    build(root) {
      root.innerHTML = `
        <div class="abs kicker" data-ref="kicker" style="left:80px;top:212px">KEY TAKEAWAYS</div>
        ${ROWS.map((txt, i) => `
          <div class="abs" data-ref="row${i}" style="left:80px;top:${350 + i * 190}px;width:920px">
            <div style="display:flex;align-items:baseline;gap:26px">
              <span style="font:700 76px/1 var(--mono);color:var(--gold)">0${i + 1}</span>
              <span style="font:300 64px/1 var(--sans);color:var(--muted)">—</span>
              <span class="h3" style="font-size:54px">${txt}</span>
            </div>
            <div style="margin-top:34px;height:2px;background:var(--line)"><div data-ref="line${i}" style="height:100%;width:0;background:linear-gradient(90deg,var(--gold),transparent)"></div></div>
          </div>`).join("")}

        <div class="abs" data-ref="final" style="left:80px;top:1040px;width:920px">
          <div class="h1" style="font-size:112px;line-height:1.0">CONVENIENCE<br>SHOULD NEVER<br>REPLACE <span class="gold" style="position:relative">CAUTION.<span data-ref="ul" style="position:absolute;left:0;bottom:-14px;height:8px;width:0;background:var(--green);border-radius:4px;box-shadow:0 0 18px var(--green)"></span></span></div>
        </div>
      `;
    },
    update(t, r) {
      reveal(r.kicker, t, K.kicker, { dx: -30, dy: 0 });
      const settle = prog(t, K.settle, 0.8, Ease.inOut);
      K.rows.forEach((s, i) => {
        const a = reveal(r["row" + i], t, s, { dx: -60, dy: 0, dur: 0.9, blur: 6 });
        r["row" + i].style.opacity = (a * lerp(1, 0.5, settle)).toFixed(3);
        r["line" + i].style.width = (prog(t, s + 0.3, 1.1, Ease.inOut) * 100).toFixed(2) + "%";
      });
      reveal(r.final, t, K.final, { dy: 70, blur: 12, dur: 1.0 });
      r.ul.style.width = (prog(t, K.underline, 0.9, Ease.inOut) * 100).toFixed(2) + "%";
    },
  });
})();
