/* SCENE 3: UNDERSTAND THE COST
   A fictional, clearly labelled loan-offer interface. A spotlight moves
   across KFS → APR → fees → EMI & schedule, each with a short explanation.

   Illustrative maths (reducing balance, 12 monthly instalments):
     principal ₹50,000 · interest 18% p.a. · processing fee ₹1,000 + 18% GST = ₹1,180 (deducted upfront)
     EMI = ₹4,584 (exact 4,583.9996) · 12 × ₹4,584 = ₹55,008 repaid · net disbursed = ₹50,000 − ₹1,180 = ₹48,820
     interest = ₹5,008 (schedule below sums to it) · total cost of credit = ₹5,008 + ₹1,180 = ₹6,188 = ₹55,008 − ₹48,820
     APR (monthly IRR × 12 on the net amount) = 22.63% ≈ 22.6% p.a. */
(function () {
  const { reveal, prog, lerp, Ease, Icons } = Anim;

  const K = { kicker: 0.3, title: 0.6, card: 1.2, rows: 1.8, chart: 3.4, spot: [4.4, 7.3, 10.2, 13.1], spotEnd: 16.0, verdict: 16.4, verdictSub: 17.4 };

  const CARD = { left: 80, top: 384, w: 920, h: 1070 };
  const ROW0 = 312, ROWH = 88;
  const ROWS = [
    { k: "kfs",  label: "Key Facts Statement (KFS)", value: "VIEW  ›", cls: "green", icon: true },
    { k: "amt",  label: "Loan amount",                value: "₹50,000" },
    { k: "rate", label: "Interest rate (reducing)",   value: "18.0% p.a." },
    { k: "fee",  label: "Processing fee (₹1,000 + 18% GST)", value: "₹1,180" },
    { k: "net",  label: "Net disbursed (₹50,000 − ₹1,180)", value: "₹48,820" },
    { k: "apr",  label: "APR (all-inclusive)",        value: "≈ 22.6% p.a.", cls: "gold" },
    { k: "emi",  label: "Repayment: 12 × ₹4,584",     value: "₹55,008 total" },
  ];
  const SCHED = [[750, 3834], [692, 3892], [634, 3950], [575, 4009], [515, 4069], [454, 4130], [392, 4192], [329, 4255], [265, 4319], [200, 4384], [134, 4450], [68, 4516]];
  const CHART_Y = ROW0 + ROWS.length * ROWH + 14;

  // Spotlight targets (card-relative rectangles) + captions
  const SPOTS = [
    { rect: [20, ROW0 + 0 * ROWH - 4, 880, ROWH + 8], tag: "KFS", head: "KEY FACTS STATEMENT",
      text: "A standardised summary of the loan's key terms, given to you <b class='white'>before you sign</b> the loan contract." },
    { rect: [20, ROW0 + 5 * ROWH - 4, 880, ROWH + 8], tag: "APR", head: "ANNUAL PERCENTAGE RATE",
      text: "The <b class='white'>all-inclusive annual cost</b>: interest plus fees and charges. Here, 18% interest + ₹1,180 fee ≈ <b class='gold'>22.6% APR</b>." },
    { rect: [20, ROW0 + 3 * ROWH - 4, 880, ROWH + 8], tag: "FEES", head: "APPLICABLE FEES",
      text: "₹1,000 + 18% GST = ₹1,180, deducted upfront. Charges <b class='white'>not disclosed in the KFS cannot be levied</b> later." },
    { rect: [20, 130, 880, 1070 - 130 - 18], tag: "EMI", head: "EMI & REPAYMENT SCHEDULE",
      text: "12 × ₹4,584 = <b class='white'>₹55,008 repaid for ₹48,820 received</b>: a total cost of ₹6,188." },
  ];

  Scene.define("cost", {
    title: "Understand the cost",
    base: 20,
    build(root) {
      const maxV = 4584;
      root.innerHTML = `
        <div class="abs kicker" data-ref="kicker" style="left:80px;top:212px">STEP 02 · WHAT IS THE REAL COST?</div>
        <div class="abs h2" data-ref="title" style="left:80px;top:262px">UNDERSTAND THE COST</div>

        <div class="abs card" data-ref="card" style="left:${CARD.left}px;top:${CARD.top}px;width:${CARD.w}px;height:${CARD.h}px">
          <div class="abs" style="left:40px;right:40px;top:34px;display:flex;align-items:center">
            <span class="label" style="color:var(--text-2)">LOAN OFFER</span>
            <span class="tag" style="margin-left:auto;color:#ff8a83;font-size:22px">ILLUSTRATIVE EXAMPLE</span>
          </div>
          <div class="abs" style="left:40px;top:96px;font:600 26px/1 var(--sans);color:var(--text-2)">Lender: <b class="white">Example Finance Ltd</b> <span style="color:var(--muted)">(fictional NBFC)</span></div>
          <div class="abs" data-ref="hero" style="left:40px;top:150px;display:flex;align-items:baseline;gap:18px">
            <span style="font:800 112px/1 var(--sans);letter-spacing:-.03em">₹4,584</span>
            <span style="font:600 32px/1 var(--sans);color:var(--muted)">/ month · EMI</span>
          </div>
          <div class="abs rule" style="left:40px;right:40px;top:${ROW0 - 18}px"></div>
          ${ROWS.map((row, i) => `
            <div class="abs" data-ref="row${i}" style="left:40px;right:40px;top:${ROW0 + i * ROWH}px;height:${ROWH}px;display:flex;align-items:center;border-bottom:1.5px solid rgba(255,255,255,.07)">
              ${row.icon ? `<span style="color:var(--green);margin-right:16px;display:flex">${Icons.doc(40)}</span>` : ""}
              <span style="font:500 30px/1 var(--sans);color:var(--text-2)">${row.label}</span>
              <span class="${row.cls || "white"}" style="margin-left:auto;font:${row.cls === "green" ? "700 24px/1 var(--mono);letter-spacing:.12em" : "700 32px/1 var(--sans)"}">${row.value}</span>
            </div>`).join("")}
          <div class="abs" data-ref="chart" style="left:40px;right:40px;top:${CHART_Y}px;height:78px;display:flex;align-items:flex-end;gap:8px">
            ${SCHED.map(([int, pri], i) => `
              <div data-ref="bar${i}" style="flex:1;height:${(78 * (int + pri)) / maxV}px;display:flex;flex-direction:column;border-radius:4px;overflow:hidden;transform-origin:50% 100%">
                <div style="height:${(100 * int) / (int + pri)}%;background:var(--gold)"></div><div style="flex:1;background:rgba(255,255,255,.22)"></div>
              </div>`).join("")}
          </div>
          <div class="abs label" data-ref="legend" style="left:40px;top:${CHART_Y + 90}px;font-size:21px"><span class="gold">■</span> INTEREST &nbsp;&nbsp; <span style="color:#777">■</span> PRINCIPAL &nbsp;&nbsp; · &nbsp; MONTHS 1–12</div>
          <div class="abs" data-ref="spot" style="left:0;top:0;border:3px solid var(--gold-2);border-radius:18px;box-shadow:0 0 0 2000px rgba(0,0,0,.0),0 0 40px rgba(244,211,124,.45),inset 0 0 30px rgba(244,211,124,.12);pointer-events:none"></div>
        </div>

        <div class="abs card gold-edge" data-ref="cap" style="left:80px;top:1474px;width:920px;height:236px;padding:28px 36px">
          ${SPOTS.map((s, i) => `
            <div class="abs" data-ref="cap${i}" style="left:36px;right:36px;top:28px">
              <div style="display:flex;align-items:center;gap:16px"><span class="tag" style="color:var(--gold);font-size:21px">${s.tag}</span><span class="label" style="color:var(--text);font-size:24px">${s.head}</span></div>
              <div class="body" style="margin-top:16px;font-size:31px;line-height:1.36;color:var(--text)">${s.text}</div>
            </div>`).join("")}
        </div>

        <div class="abs" data-ref="verdict" style="left:80px;top:760px;width:920px;text-align:center">
          <div class="label" style="color:var(--green);font-size:24px">RULE OF THUMB</div>
          <div class="h1" style="margin-top:30px;font-size:104px">DON'T JUDGE<br>A LOAN BY<br><span class="gold">EMI ALONE.</span></div>
          <div class="lead" data-ref="verdictSub" style="margin-top:40px">Compare the <b class="white">APR</b> and the <b class="white">total amount payable</b> in the KFS.<br><span class="small" style="font-size:29px">Also note the cooling-off (look-up) period, during which you can exit by repaying the principal and proportionate APR, without penalty.</span></div>
        </div>
      `;
    },
    update(t, r) {
      reveal(r.kicker, t, K.kicker, { dx: -30, dy: 0 });
      reveal(r.title, t, K.title, { dy: 50, blur: 8 });
      reveal(r.card, t, K.card, { dy: 80, scale: 0.97, dur: 0.9 });
      reveal(r.hero, t, K.card + 0.3, { dy: 20 });
      ROWS.forEach((_, i) => reveal(r["row" + i], t, K.rows + i * 0.2, { dx: -24, dy: 0 }));
      SCHED.forEach((_, i) => {
        const p = prog(t, K.chart + i * 0.05, 0.6, Ease.outBack);
        r["bar" + i].style.transform = `scaleY(${Math.max(0, p).toFixed(4)})`;
      });
      reveal(r.legend, t, K.chart + 0.6, { dy: 10 });

      // spotlight: glide between targets, dim everything else
      let idx = -1;
      K.spot.forEach((s, i) => { if (t >= s) idx = i; });
      const active = t >= K.spot[0] && t < K.spotEnd + 0.4;
      const sOn = prog(t, K.spot[0], 0.5) * (1 - prog(t, K.spotEnd, 0.5));
      r.spot.style.opacity = sOn.toFixed(3);
      if (idx >= 0) {
        const from = SPOTS[Math.max(0, idx - 1)].rect, to = SPOTS[idx].rect;
        const m = idx === 0 ? 1 : prog(t, K.spot[idx], 0.7, Ease.inOut);
        const [x, y, w, h] = to.map((v, j) => lerp(from[j], v, m));
        Object.assign(r.spot.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
      }
      // dim non-highlighted rows
      const litRows = { 0: [0], 1: [5], 2: [3], 3: [6, "hero", "chart"] };
      ROWS.forEach((_, i) => {
        const lit = !active || idx < 0 || litRows[idx].includes(i);
        const base = +r["row" + i].style.opacity || 0;
        r["row" + i].style.opacity = (base * (lit ? 1 : lerp(1, 0.32, sOn))).toFixed(3);
      });
      const heroLit = !active || idx !== -1 && litRows[idx] && litRows[idx].includes("hero");
      r.hero.style.opacity = ((+r.hero.style.opacity || 0) * (heroLit || idx < 0 ? 1 : lerp(1, 0.32, sOn))).toFixed(3);
      const chartLit = idx < 0 || !active || idx === 3;
      r.chart.style.opacity = chartLit ? 1 : lerp(1, 0.32, sOn).toFixed(3);

      // captions
      reveal(r.cap, t, K.spot[0], { end: K.spotEnd, dy: 40 });
      K.spot.forEach((s, i) => reveal(r["cap" + i], t, s + 0.2, { end: i < 3 ? K.spot[i + 1] - 0.1 : K.spotEnd, dy: 16, outDur: 0.3 }));

      // verdict: card recedes, statement takes over
      const v = prog(t, K.verdict, 0.9, Ease.inOut);
      if (v > 0) {
        r.card.style.opacity = (+r.card.style.opacity * lerp(1, 0.12, v)).toFixed(3);
        r.card.style.transform += ` scale(${lerp(1, 0.94, v).toFixed(4)})`;
        r.card.style.filter = `blur(${(v * 6).toFixed(2)}px)`;
      } else r.card.style.filter = "";
      reveal(r.verdict, t, K.verdict + 0.2, { dy: 60, blur: 10, dur: 0.9 });
      reveal(r.verdictSub, t, K.verdictSub, { dy: 20 });
    },
  });
})();
