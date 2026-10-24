/* SCENE 1: HOOK
   "INSTANT LOAN." / "BUT IS IT SAFE?" → fictional phone notification → three questions. */
(function () {
  const { reveal, prog, lerp, Ease, Icons } = Anim;

  // Keyframes (seconds, in the scene's base timing)
  const K = {
    line1: 0.3, line2: 1.1, phone: 1.7, notif: 2.7, timer: 3.5, cta: 4.2, tap: 5.0,
    headOut: 6.0, shrink: 6.1, ask: 7.0, q: [7.4, 8.6, 9.8],
  };
  const QUESTIONS = ["WHO IS THE LENDER?", "WHAT IS THE REAL COST?", "HOW IS YOUR DATA USED?"];

  Scene.define("hook", {
    title: "Hook",
    base: 14,
    build(root) {
      root.innerHTML = `
        <div class="abs h1" data-ref="l1" style="left:80px;top:250px">INSTANT LOAN.</div>
        <div class="abs h1 gold" data-ref="l2" style="left:80px;top:366px">BUT IS IT SAFE?</div>

        <div class="abs" data-ref="phoneWrap" style="left:260px;top:600px;width:560px;height:1040px">
          <div data-ref="phone" style="position:absolute;inset:0;border-radius:72px;border:3px solid #2c2c2e;background:linear-gradient(170deg,#18181a 0%,#0b0b0c 55%,#101012 100%);box-shadow:0 0 0 10px #0e0e0f,0 0 0 12px #262628,0 40px 120px rgba(0,0,0,.8),0 0 120px rgba(226,184,75,.10);overflow:hidden">
            <div style="position:absolute;left:50%;top:22px;width:150px;height:38px;margin-left:-75px;border-radius:20px;background:#000"></div>
            <div style="position:absolute;left:0;right:0;top:120px;text-align:center;font:300 150px/1 var(--sans);letter-spacing:-.04em;color:#f3f2ec">09:41</div>
            <div style="position:absolute;left:0;right:0;top:282px;text-align:center;font:500 28px/1 var(--sans);color:#a8a7a1">Saturday, 24 October</div>

            <div data-ref="notif" style="position:absolute;left:24px;right:24px;top:360px;border-radius:30px;background:rgba(255,255,255,.085);border:1px solid rgba(255,255,255,.12);padding:24px 26px;backdrop-filter:blur(10px)">
              <div style="display:flex;align-items:center;gap:14px">
                <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,var(--gold-2),var(--gold));display:flex;align-items:center;justify-content:center;color:#111;font:800 30px/1 var(--sans)">₹</div>
                <div style="font:600 20px/1 var(--mono);letter-spacing:.12em;color:#cfcec8">QUICKCASH</div>
                <div style="margin-left:auto;font:500 20px/1 var(--sans);color:#8d8c86">now</div>
              </div>
              <div style="margin-top:18px;font:700 34px/1.2 var(--sans);color:#fff">₹50,000 pre-approved</div>
              <div style="margin-top:8px;font:500 26px/1.35 var(--sans);color:#c9c8c2">Money in your account in 5 minutes. No paperwork. Tap to claim.</div>
            </div>

            <div data-ref="timer" style="position:absolute;left:24px;right:24px;top:640px;border-radius:24px;background:rgba(255,95,86,.10);border:1px solid rgba(255,95,86,.35);padding:18px 24px;display:flex;align-items:center;gap:14px">
              <div style="font:600 20px/1 var(--mono);letter-spacing:.12em;color:#ff8a83">OFFER EXPIRES IN</div>
              <div data-ref="clock" style="margin-left:auto;font:700 32px/1 var(--mono);color:#fff">09:59</div>
            </div>

            <div data-ref="cta" style="position:absolute;left:44px;right:44px;top:840px;height:96px;border-radius:48px;background:linear-gradient(90deg,var(--gold),var(--gold-2));display:flex;align-items:center;justify-content:center;font:800 32px/1 var(--sans);letter-spacing:.04em;color:#111">ACCEPT LOAN  ›</div>
            <div data-ref="ripple" style="position:absolute;left:280px;top:888px;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:4px solid #fff"></div>
          </div>
        </div>
        <div class="abs label" data-ref="fict" style="left:0;width:1080px;text-align:center;top:1688px;color:#76756f">ILLUSTRATION · FICTIONAL APP AND OFFER</div>

        <div class="abs kicker" data-ref="ask" style="left:80px;top:850px">BEFORE YOU TAP, ASK</div>
        ${QUESTIONS.map((q, i) => `
          <div class="abs card ${i === 0 ? "gold-edge" : ""}" data-ref="q${i}" style="left:80px;top:${910 + i * 240}px;width:920px;height:206px;display:flex;align-items:center;gap:34px;padding:0 44px">
            <div style="font:700 44px/1 var(--mono);color:var(--gold)">0${i + 1}</div>
            <div style="width:2px;height:96px;background:var(--line)"></div>
            <div class="h3" style="flex:1;font-size:52px">${q}</div>
            <div class="icon-ring green" style="width:84px;height:84px;border-radius:50%;font:800 46px/1 var(--sans);color:var(--green)">?</div>
          </div>`).join("")}
      `;
    },
    update(t, r) {
      reveal(r.l1, t, K.line1, { end: K.headOut, dy: 60, blur: 10 });
      reveal(r.l2, t, K.line2, { end: K.headOut, dy: 60, blur: 10 });

      // phone rises, then shrinks to the top to make room for the questions
      const pin = prog(t, K.phone, 1.1, Ease.outQuint);
      const ps = prog(t, K.shrink, 1.1, Ease.inOut);
      const scale = lerp(1, 0.56, ps);
      const y = lerp(260, 0, pin) + lerp(0, -390, ps);
      r.phoneWrap.style.opacity = pin;
      r.phoneWrap.style.transformOrigin = "50% 0";
      r.phoneWrap.style.transform = `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(4)})`;
      reveal(r.fict, t, K.phone + 0.6, { end: K.shrink, dy: 10 });

      // notification drops in with a soft overshoot
      const n = prog(t, K.notif, 0.8, Ease.outBack);
      r.notif.style.opacity = Math.min(1, n * 1.4);
      r.notif.style.transform = `translateY(${lerp(-80, 0, n).toFixed(1)}px) scale(${lerp(0.92, 1, n).toFixed(4)})`;
      reveal(r.timer, t, K.timer, { dy: 30 });
      const secs = Math.max(0, 599 - Math.floor(Math.max(0, t - K.timer) * 1));
      r.clock.textContent = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

      reveal(r.cta, t, K.cta, { dy: 30 });
      const pulse = t > K.cta + 0.7 ? 1 + 0.025 * Math.sin((t - K.cta) * 6) : 1;
      if (t > K.cta + 0.7) r.cta.style.transform = `scale(${pulse.toFixed(4)})`;
      r.cta.style.boxShadow = `0 0 ${(40 + 30 * Math.max(0, Math.sin((t - K.cta) * 6))).toFixed(0)}px rgba(226,184,75,.45)`;

      // tap ripple
      const rp = prog(t, K.tap, 0.9, Ease.out);
      r.ripple.style.opacity = t < K.tap ? 0 : (1 - rp).toFixed(3);
      r.ripple.style.transform = `scale(${(1 + rp * 9).toFixed(3)})`;
      r.ripple.style.visibility = t < K.tap ? "hidden" : "visible";

      reveal(r.ask, t, K.ask, { dx: -30, dy: 0 });
      K.q.forEach((qs, i) => reveal(r["q" + i], t, qs, { dy: 70, scale: 0.96, dur: 0.8 }));
      // gentle emphasis sweep across the three questions once all are in
      K.q.forEach((qs, i) => {
        const hi = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - (11 + i * 0.5)) / 1.0))));
        if (t > qs + 0.8) r["q" + i].style.borderColor = hi > 0.01 ? `rgba(226,184,75,${(0.25 + 0.6 * hi).toFixed(3)})` : "";
      });
    },
  });
})();
