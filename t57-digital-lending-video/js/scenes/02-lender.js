/* SCENE 2: IDENTIFY THE LENDER
   Two interface panels (regulated lender / digital lending platform) linked by
   a connecting diagram, plus the key point that they need not be the same entity. */
(function () {
  const { reveal, prog, draw, along, Ease, Icons } = Anim;

  const K = { kicker: 0.3, title: 0.6, a: 1.4, aB: [2.2, 2.7, 3.2], link: 4.2, linkLabel: 4.9, b: 5.4, bB: [6.2, 6.7, 7.2], call: 8.8, callSub: 9.8, neq: 10.8 };

  const LENDER = ["Sanctions and funds the loan", "The loan sits on its books", "Bears regulatory responsibility"];
  const PLATFORM = ["The app or website you interact with", "Sourcing, onboarding, servicing support", "Acts on behalf of the lender"];

  const panel = (ref, cls, icon, title, sub, tag, tagColor, bullets, mk, mkColor) => `
    <div class="abs card ${cls}" data-ref="${ref}" style="left:80px;width:920px;height:330px;padding:34px 40px">
      <div style="display:flex;align-items:center;gap:26px">
        <div class="icon-ring ${tagColor}" style="width:92px;height:92px;color:var(--${tagColor})">${icon}</div>
        <div style="flex:1">
          <div class="label" style="color:var(--${tagColor});font-size:19px;margin-bottom:10px">${tag}</div>
          <div style="font:800 40px/1.05 var(--sans);letter-spacing:-.01em">${title}</div>
          <div class="small" style="margin-top:8px;font-size:23px">${sub}</div>
        </div>
      </div>
      <div style="margin-top:22px;display:flex;flex-direction:column;gap:10px">
        ${bullets.map((b, i) => `<div class="bullet" data-ref="${ref}b${i}" style="font-size:29px"><span class="mk" style="color:var(--${mkColor})">${mk}</span>${b}</div>`).join("")}
      </div>
    </div>`;

  Scene.define("lender", {
    title: "Identify the lender",
    base: 16,
    build(root) {
      root.innerHTML = `
        <div class="abs kicker" data-ref="kicker" style="left:80px;top:212px">STEP 01 · WHO IS THE LENDER?</div>
        <div class="abs h2" data-ref="title" style="left:80px;top:262px">IDENTIFY THE LENDER</div>

        ${panel("a", "gold-edge", Icons.bank(54), "REGULATED LENDER", "Regulated entity (RE), e.g. a bank or an NBFC", "ROLE · LENDS", "gold", LENDER, "✓", "gold")}
        ${panel("b", "green-edge", Icons.phone(54), "DIGITAL LENDING PLATFORM", "Digital lending app (DLA) / lending service provider (LSP)", "ROLE · FACILITATES", "green", PLATFORM, "→", "green")}

        <svg class="abs" data-ref="svg" width="1080" height="1920" style="left:0;top:0;overflow:visible;pointer-events:none">
          <path data-ref="linkL" d="M380 742 L380 878" stroke="var(--gold)" stroke-width="3" fill="none"/>
          <path data-ref="linkR" d="M700 878 L700 742" stroke="var(--green)" stroke-width="3" fill="none"/>
          <path d="M370 864 L380 878 L390 864" data-ref="arrL" stroke="var(--gold)" stroke-width="3" fill="none"/>
          <path d="M690 756 L700 742 L710 756" data-ref="arrR" stroke="var(--green)" stroke-width="3" fill="none"/>
          ${[0, 1, 2].map((i) => `<circle data-ref="dl${i}" r="6" fill="var(--gold)"/><circle data-ref="dr${i}" r="6" fill="var(--green)"/>`).join("")}
        </svg>
        <div class="abs label" data-ref="lblL" style="left:150px;top:796px;width:210px;text-align:right;color:var(--gold);line-height:1.35">FUNDS &amp;<br>OVERSEES</div>
        <div class="abs label" data-ref="lblR" style="left:722px;top:796px;width:230px;color:var(--green);line-height:1.35">SOURCES &amp;<br>SERVICES</div>
        <div class="abs" data-ref="lblC" style="left:420px;top:785px;width:240px;height:50px;border-radius:25px;border:1.5px solid var(--line-strong);background:#0b0b0c;display:flex;align-items:center;justify-content:center;font:600 19px/1 var(--mono);letter-spacing:.12em;color:var(--text-2)">OUTSOURCING</div>

        <div class="abs card" data-ref="call" style="left:80px;top:1264px;width:920px;height:390px;padding:40px 44px 0 64px;overflow:hidden">
          <div style="position:absolute;left:0;top:0;bottom:0;width:10px;background:linear-gradient(var(--gold),var(--gold-2))"></div>
          <div class="h3" style="font-size:50px">THE APP YOU SEE <span class="gold" data-ref="neq">≠</span> THE LENDER YOU OWE.</div>
          <div class="body" data-ref="callSub" style="margin-top:22px;font-size:29px">The platform and the actual lender are <b class="white">not necessarily the same entity</b>. Check the lender's name in the app, the KFS and the loan agreement, and cross-check RBI's public directory of digital lending apps.</div>
        </div>
      `;
    },
    update(t, r) {
      reveal(r.kicker, t, K.kicker, { dx: -30, dy: 0 });
      reveal(r.title, t, K.title, { dy: 50, blur: 8 });

      r.a.style.top = "410px";
      r.b.style.top = "880px";
      reveal(r.a, t, K.a, { dy: 60, scale: 0.97, dur: 0.9 });
      K.aB.forEach((s, i) => reveal(r["ab" + i], t, s, { dx: -24, dy: 0 }));
      reveal(r.b, t, K.b, { dy: 60, scale: 0.97, dur: 0.9 });
      K.bB.forEach((s, i) => reveal(r["bb" + i], t, s, { dx: -24, dy: 0 }));

      // connector diagram
      const lp = prog(t, K.link, 0.9, Ease.inOut);
      draw(r.linkL, lp); draw(r.linkR, lp);
      const ap = prog(t, K.link + 0.8, 0.3);
      r.arrL.style.opacity = ap; r.arrR.style.opacity = ap;
      reveal(r.lblC, t, K.linkLabel, { scale: 0.8, dy: 0 });
      reveal(r.lblL, t, K.linkLabel + 0.2, { dx: 20, dy: 0 });
      reveal(r.lblR, t, K.linkLabel + 0.2, { dx: -20, dy: 0 });
      for (let i = 0; i < 3; i++) {
        const on = t > K.link + 1;
        const ph = (((t - K.link) * 0.55 + i / 3) % 1 + 1) % 1;
        const pL = along(r.linkL, ph), pR = along(r.linkR, ph);
        r["dl" + i].setAttribute("cx", pL.x); r["dl" + i].setAttribute("cy", pL.y);
        r["dr" + i].setAttribute("cx", pR.x); r["dr" + i].setAttribute("cy", pR.y);
        const fade = on ? Math.sin(Math.PI * ph) : 0;
        r["dl" + i].style.opacity = fade; r["dr" + i].style.opacity = fade;
      }

      reveal(r.call, t, K.call, { dy: 60, dur: 0.9 });
      reveal(r.callSub, t, K.callSub, { dy: 20 });
      const g = prog(t, K.neq, 0.5) * (1 - prog(t, K.neq + 1.6, 0.8));
      r.neq.style.textShadow = `0 0 ${(30 * g).toFixed(1)}px rgba(244,211,124,${(0.9 * g).toFixed(2)})`;
    },
  });
})();
