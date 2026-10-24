/* SCENE 5: ACCOUNTABILITY
   Lender, platform and borrower as connected nodes. "Responsibility" stays
   anchored to the regulated lender, even when services are outsourced.
   The lender (solid gold) and the platform (dashed green) carry explicit role chips. */
(function () {
  const { reveal, prog, draw, lerp, Ease, Icons } = Anim;

  const K = { kicker: 0.3, title: 0.6, nodes: [1.2, 1.7, 2.1], roles: [1.9, 2.4, 2.8], edges: 2.6, ring: 3.6, tug: 4.6, statement: 6.8, support: 9.6, supportSub: 10.4 };
  const N = { lender: [540, 520], platform: [250, 950], borrower: [830, 950] };

  const node = (ref, [x, y], r, cls, color, icon, name, role, w = 320, dashed = false) => `
    <div class="abs" data-ref="${ref}" style="left:${x - w / 2}px;top:${y - r}px;width:${w}px;text-align:center">
      <div class="icon-ring ${cls}" style="margin:0 auto;width:${2 * r}px;height:${2 * r}px;border-radius:50%;color:var(--${color});background:#0c0c0d;border-width:3px;${dashed ? "border-style:dashed" : ""}">${icon}</div>
      <div style="margin-top:38px;font:800 29px/1.1 var(--sans)">${name}</div>
      <div data-ref="${ref}Role" style="margin-top:12px"><span class="tag" style="color:var(--${color});font-size:20px">${role}</span></div>
    </div>`;

  Scene.define("accountability", {
    title: "Accountability",
    base: 15,
    build(root) {
      const [lx, ly] = N.lender, [px, py] = N.platform, [bx, by] = N.borrower;
      root.innerHTML = `
        <div class="abs kicker" data-ref="kicker" style="left:80px;top:212px">STEP 04 · WHO IS ACCOUNTABLE?</div>
        <div class="abs h2" data-ref="title" style="left:80px;top:262px">ACCOUNTABILITY</div>

        <svg class="abs" width="1080" height="1920" style="left:0;top:0;overflow:visible;pointer-events:none">
          <path data-ref="eLP" d="M${lx - 110} ${ly + 245} L${px + 40} ${py - 95}" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none" stroke-dasharray="2 0"/>
          <path data-ref="eLB" d="M${lx + 110} ${ly + 245} L${bx - 40} ${by - 95}" stroke="var(--gold)" stroke-width="3" fill="none"/>
          <path data-ref="ePB" d="M${px + 95} ${py} L${bx - 95} ${by}" stroke="rgba(60,255,142,.6)" stroke-width="3" fill="none"/>
          <circle data-ref="ring" cx="${lx}" cy="${ly}" r="124" fill="none" stroke="var(--gold)" stroke-width="3" stroke-dasharray="10 12"/>
          <circle data-ref="halo" cx="${lx}" cy="${ly}" r="134" fill="none" stroke="rgba(226,184,75,.25)" stroke-width="18"/>
        </svg>
        <div class="abs label" data-ref="tLP" style="left:60px;top:772px;width:270px;text-align:right;font-size:20px;line-height:1.45">OUTSOURCES<br>SERVICES TO</div>
        <div class="abs label" data-ref="tLB" style="left:752px;top:772px;width:270px;font-size:20px;line-height:1.45;color:var(--gold)">LOAN<br>CONTRACT</div>
        <div class="abs label" data-ref="tPB" style="left:390px;top:966px;width:300px;text-align:center;font-size:20px;color:var(--green)">APP INTERFACE</div>

        ${node("nL", N.lender, 100, "gold", "gold", Icons.bank(76), "REGULATED LENDER · BANK / NBFC", "LENDS · STAYS ACCOUNTABLE", 600)}
        ${node("nP", N.platform, 80, "green", "green", Icons.phone(56), "DIGITAL LENDING<br>PLATFORM (DLA / LSP)", "SERVICE PROVIDER", 400, true)}
        ${node("nB", N.borrower, 80, "", "text", Icons.user(56), "BORROWER", "YOU", 320)}
        <div class="abs" data-ref="reject" style="left:${N.platform[0] - 80}px;top:${N.platform[1] - 80}px;width:160px;height:160px;border-radius:50%;border:4px solid var(--red);background:rgba(20,8,8,.85);display:flex;align-items:center;justify-content:center;color:var(--red)">${Icons.x(72, "var(--red)", 3.4)}</div>

        <div class="abs" data-ref="resp" style="left:0;top:0;padding:12px 18px;border-radius:999px;background:var(--gold);color:#111;font:700 20px/1 var(--mono);letter-spacing:.12em;display:flex;align-items:center;gap:10px;white-space:nowrap">${Icons.lock(24, "#111", 3.2)} RESPONSIBILITY</div>

        <div class="abs" data-ref="statement" style="left:80px;top:1218px;width:920px">
          <div class="h3" style="font-size:56px;line-height:1.08">OUTSOURCING DOES <span class="gold">NOT AUTOMATICALLY REMOVE</span> LENDER RESPONSIBILITY.</div>
        </div>

        <div class="abs card green-edge" data-ref="support" style="left:80px;top:1434px;width:920px;height:300px;padding:30px 36px;display:flex;gap:30px">
          <div class="icon-ring green" style="flex:none;width:108px;height:108px;border-radius:50%;color:var(--green)">${Icons.headset(62)}</div>
          <div>
            <div style="font:800 36px/1.15 var(--sans)">COMPLAINT? START WITH THE LENDER.</div>
            <div class="body" data-ref="supportSub" style="margin-top:12px;font-size:29px;line-height:1.36;color:var(--text)">Use the grievance redressal officer's details shown in the app or website. Not resolved within 30 days? You may escalate under the <b class="white">RBI Integrated Ombudsman Scheme</b>.</div>
          </div>
        </div>
      `;
    },
    update(t, r) {
      const [lx, ly] = N.lender, [px, py] = N.platform;
      reveal(r.kicker, t, K.kicker, { dx: -30, dy: 0 });
      reveal(r.title, t, K.title, { dy: 50, blur: 8 });
      ["nL", "nP", "nB"].forEach((k, i) => reveal(r[k], t, K.nodes[i], { scale: 0.7, dy: 20, ease: Ease.outBack, dur: 0.8 }));
      draw(r.eLP, prog(t, K.edges, 0.8, Ease.inOut));
      draw(r.eLB, prog(t, K.edges + 0.25, 0.8, Ease.inOut));
      draw(r.ePB, prog(t, K.edges + 0.5, 0.8, Ease.inOut));
      ["nL", "nP", "nB"].forEach((k, i) => reveal(r[k + "Role"], t, K.roles[i], { dy: 14, scale: 0.9 }));
      reveal(r.tLP, t, K.edges + 0.6, { dy: 10 });
      reveal(r.tLB, t, K.edges + 0.8, { dy: 10 });
      reveal(r.tPB, t, K.edges + 1.0, { dy: 10 });

      // gold ring rotates slowly around the lender; halo breathes
      const ringOn = prog(t, K.ring, 0.8);
      r.ring.style.opacity = ringOn;
      r.ring.style.transformOrigin = `${lx}px ${ly}px`;
      r.ring.style.transform = `rotate(${(t * 14).toFixed(2)}deg)`;
      r.halo.style.opacity = (ringOn * (0.55 + 0.45 * Math.sin(t * 2.2))).toFixed(3);

      // the RESPONSIBILITY badge is pulled toward the platform, then springs back
      const home = [lx - 265, ly - 40], away = [px, py - 128];
      const go = prog(t, K.tug, 0.9, Ease.inOut), back = prog(t, K.tug + 1.1, 0.9, Ease.outBack);
      const m = go * (1 - back);
      const bx = lerp(home[0], away[0], m), by = lerp(home[1], away[1], m);
      const a = prog(t, K.ring + 0.2, 0.5);
      r.resp.style.opacity = a;
      r.resp.style.transform = `translate(${(bx - 125).toFixed(1)}px, ${(by - 22).toFixed(1)}px) scale(${lerp(0.7, 1, a).toFixed(3)})`;

      // at the peak of the tug the platform rejects it: responsibility is not transferred
      const rej = Math.max(0, Math.min(1, (m - 0.55) / 0.3));
      r.reject.style.opacity = rej.toFixed(3);
      r.reject.style.transform = `scale(${lerp(0.6, 1, rej).toFixed(3)})`;
      reveal(r.statement, t, K.statement, { dy: 50, blur: 8, dur: 0.9 });
      reveal(r.support, t, K.support, { dy: 60, scale: 0.97 });
      reveal(r.supportSub, t, K.supportSub, { dy: 16 });
    },
  });
})();
