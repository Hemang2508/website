/* SCENE 4: DATA PRIVACY AND FUND FLOWS
   Part A: privacy shield + permission controls → "CHECK PERMISSIONS."
   Part B: money-flow diagram (lender ⇄ borrower), no pass-through accounts,
           suspicious payment request, regulatory-exception qualifier. */
(function () {
  const { reveal, prog, draw, along, lerp, Ease, Icons } = Anim;

  const K = {
    kicker: 0.3, titleA: 0.6, shield: 1.2, panel: 2.0, perms: [2.6, 3.0, 3.4, 3.8, 4.2], flip: [4.8, 5.2, 5.6], consent: 6.4, checkA: 7.4,
    outA: 9.4, titleB: 9.9, lender: 10.3, borrower: 10.6, flowDraw: 11.0, platform: 12.4, lines: [13.6, 14.5, 15.4], scam: 15.9, stamp: 16.7, note: 17.4, scamOut: 18.7,
  };

  const PERMS = [
    { icon: "folder", name: "Files & media", rule: "NOT PERMITTED", color: "red", flip: 0 },
    { icon: "contacts", name: "Contact list", rule: "NOT PERMITTED", color: "red", flip: 1 },
    { icon: "call", name: "Call logs", rule: "NOT PERMITTED", color: "red", flip: 2 },
    { icon: "camera", name: "Camera / microphone", rule: "ONE-TIME · KYC · CONSENT", color: "gold" },
    { icon: "pin", name: "Location", rule: "ONE-TIME · WITH CONSENT", color: "gold" },
  ];

  Scene.define("data", {
    title: "Data & fund flows",
    base: 20,
    build(root) {
      root.innerHTML = `
        <div class="abs kicker" data-ref="kicker" style="left:80px;top:212px">STEP 03 · HOW IS YOUR DATA USED?</div>
        <div class="abs h2" data-ref="titleA" style="left:80px;top:262px">PROTECT YOUR DATA</div>
        <div class="abs h2" data-ref="titleB" style="left:80px;top:262px">FOLLOW THE MONEY</div>

        <!-- ===== Part A ===== -->
        <div class="abs" data-ref="partA" style="left:0;top:0;width:1080px;height:1920px">
          <svg class="abs" data-ref="shield" width="240" height="260" viewBox="0 0 240 260" style="left:420px;top:390px;overflow:visible">
            <defs><radialGradient id="shg" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="rgba(60,255,142,.25)"/><stop offset="1" stop-color="rgba(60,255,142,0)"/></radialGradient></defs>
            <path data-ref="shFill" d="M120 12 30 46v66c0 62 38 108 90 130 52-22 90-68 90-130V46z" fill="url(#shg)"/>
            <path data-ref="shPath" d="M120 12 30 46v66c0 62 38 108 90 130 52-22 90-68 90-130V46z" fill="none" stroke="var(--green)" stroke-width="5" stroke-linejoin="round"/>
            <rect data-ref="lkBody" x="88" y="118" width="64" height="52" rx="10" fill="none" stroke="var(--text)" stroke-width="5"/>
            <path data-ref="lkArc" d="M100 118v-14a20 20 0 0 1 40 0v14" fill="none" stroke="var(--text)" stroke-width="5" stroke-linecap="round"/>
            <circle data-ref="lkDot" cx="120" cy="143" r="6" fill="var(--gold)"/>
          </svg>

          <div class="abs card" data-ref="panel" style="left:80px;top:690px;width:920px;height:620px;padding:30px 40px">
            <div style="display:flex;align-items:center"><span class="label" style="color:var(--text-2)">APP PERMISSIONS</span><span class="label" style="margin-left:auto;font-size:18px">ILLUSTRATIVE SETTINGS SCREEN</span></div>
            ${PERMS.map((p, i) => `
              <div class="abs" data-ref="perm${i}" style="left:40px;right:40px;top:${88 + i * 104}px;height:96px;display:flex;align-items:center;gap:22px;border-bottom:1.5px solid rgba(255,255,255,.07)">
                <div class="icon-ring ${p.color}" style="width:64px;height:64px;border-radius:18px;color:var(--${p.color === "red" ? "red" : "gold"})">${Anim.Icons[p.icon](34)}</div>
                <div style="flex:1">
                  <div style="font:600 30px/1.1 var(--sans)">${p.name}</div>
                  <div style="margin-top:8px;font:600 18px/1 var(--mono);letter-spacing:.12em;color:var(--${p.color === "red" ? "red" : "gold"})">${p.rule}</div>
                </div>
                ${p.flip !== undefined
                  ? `<div data-ref="tg${i}" style="position:relative;width:96px;height:52px;border-radius:26px;background:var(--green)"><div data-ref="knob${i}" style="position:absolute;top:5px;left:5px;width:42px;height:42px;border-radius:50%;background:#fff"></div></div>`
                  : `<span class="tag" style="color:var(--gold);font-size:17px">ASK</span>`}
              </div>`).join("")}
          </div>

          <div class="abs body" data-ref="consent" style="left:80px;top:1340px;width:920px;font-size:30px">Collection should be <b class="white">need-based</b> and made with your <b class="white">explicit consent</b>. You can refuse, <b class="white">revoke consent</b> and ask for <b class="white">deletion</b> of your data.</div>
          <div class="abs h3 green" data-ref="checkA" style="left:80px;top:1540px;font-size:64px">CHECK PERMISSIONS.</div>
        </div>

        <!-- ===== Part B ===== -->
        <div class="abs card gold-edge" data-ref="lender" style="left:190px;top:400px;width:700px;height:150px;display:flex;align-items:center;gap:26px;padding:0 36px">
          <div class="icon-ring gold" style="width:88px;height:88px;color:var(--gold)">${Icons.bank(50)}</div>
          <div><div style="font:800 38px/1.1 var(--sans)">REGULATED LENDER</div><div class="label" style="margin-top:10px;font-size:19px">RE'S OWN BANK ACCOUNT</div></div>
        </div>
        <div class="abs card" data-ref="borrower" style="left:190px;top:860px;width:700px;height:150px;display:flex;align-items:center;gap:26px;padding:0 36px">
          <div class="icon-ring green" style="width:88px;height:88px;color:var(--green)">${Icons.user(50)}</div>
          <div><div style="font:800 38px/1.1 var(--sans)">BORROWER</div><div class="label" style="margin-top:10px;font-size:19px">YOUR OWN BANK ACCOUNT</div></div>
        </div>
        <svg class="abs" width="1080" height="1920" style="left:0;top:0;pointer-events:none;overflow:visible">
          <path data-ref="fDown" d="M400 556 L400 852" stroke="var(--gold)" stroke-width="4" fill="none"/>
          <path data-ref="fUp" d="M680 852 L680 556" stroke="var(--green)" stroke-width="4" fill="none"/>
          <path data-ref="aDown" d="M386 832 L400 852 L414 832" stroke="var(--gold)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path data-ref="aUp" d="M666 576 L680 556 L694 576" stroke="var(--green)" stroke-width="4" fill="none" stroke-linecap="round"/>
          ${[0, 1, 2, 3].map((i) => `<g data-ref="cd${i}"><circle r="15" fill="var(--gold)"/><text y="6" text-anchor="middle" font-family="Inter" font-weight="800" font-size="17" fill="#111">₹</text></g><g data-ref="cu${i}"><circle r="15" fill="var(--green)"/><text y="6" text-anchor="middle" font-family="Inter" font-weight="800" font-size="17" fill="#111">₹</text></g>`).join("")}
        </svg>
        <div class="abs label" data-ref="lDown" style="left:120px;top:676px;width:250px;text-align:right;color:var(--gold);font-size:24px">DISBURSAL ↓</div>
        <div class="abs label" data-ref="lUp" style="left:710px;top:676px;width:260px;color:var(--green);font-size:24px">↑ REPAYMENT</div>
        <div class="abs label" data-ref="lDirect" style="left:430px;top:690px;width:220px;text-align:center;font-size:17px;line-height:1.5;color:var(--text-2)">DIRECT<br>ACCOUNT-TO-<br>ACCOUNT</div>

        <div class="abs" data-ref="platform" style="left:190px;top:1050px;width:700px;height:110px;border:2px dashed rgba(255,95,86,.55);border-radius:22px;display:flex;align-items:center;gap:22px;padding:0 30px;background:rgba(255,95,86,.05)">
          <div class="icon-ring red" style="width:62px;height:62px;border-radius:50%;color:var(--red)">${Icons.x(30)}</div>
          <div style="font:600 26px/1.3 var(--sans);color:var(--text-2)">No pass-through or pool account of the <b class="white">platform or any third party</b></div>
        </div>

        <div class="abs" data-ref="ln0" style="left:80px;top:1200px;display:flex;align-items:center;gap:20px"><span class="green" style="display:flex">${Icons.check(44)}</span><span class="h3" style="font-size:44px">CHECK PERMISSIONS.</span></div>
        <div class="abs" data-ref="ln1" style="left:80px;top:1272px;display:flex;align-items:center;gap:20px"><span class="green" style="display:flex">${Icons.check(44)}</span><span class="h3" style="font-size:44px">UNDERSTAND FUND FLOWS.</span></div>
        <div class="abs" data-ref="ln2" style="left:80px;top:1344px;width:920px;display:flex;align-items:flex-start;gap:20px"><span class="gold" style="display:flex;margin-top:2px">${Icons.warn(44)}</span><span class="h3 gold" style="font-size:44px;line-height:1.12">BE CAUTIOUS OF SUSPICIOUS PAYMENT REQUESTS.</span></div>

        <div class="abs" data-ref="dim" style="left:60px;top:380px;width:960px;height:660px;border-radius:30px;background:rgba(5,5,5,.72)"></div>
        <div class="abs card red-edge" data-ref="scam" style="left:200px;top:590px;width:680px;padding:28px 34px;background:#140b0b">
          <div class="label" style="color:#ff8a83;font-size:19px">PAYMENT REQUEST · FICTIONAL EXAMPLE</div>
          <div style="margin-top:14px;font:700 32px/1.25 var(--sans)">Pay ₹2,999 "release fee" to this personal UPI ID to unlock your loan</div>
          <div data-ref="stamp" class="abs" style="right:-18px;top:-26px;transform:rotate(8deg);border:4px solid var(--red);color:var(--red);font:800 26px/1 var(--mono);letter-spacing:.14em;padding:10px 14px;border-radius:10px;background:#0b0b0b">SUSPICIOUS</div>
        </div>

        <div class="abs small" data-ref="note" style="left:80px;top:1478px;width:920px;font-size:24px;padding-top:18px;border-top:1.5px solid var(--line)">* General rule under RBI's Digital Lending Directions: disbursals and repayments move directly between the borrower's and the regulated entity's bank accounts. <b style="color:var(--text-2)">Specified regulatory exceptions may apply.</b></div>
      `;
    },
    update(t, r) {
      reveal(r.kicker, t, K.kicker, { dx: -30, dy: 0, end: K.outA });
      reveal(r.titleA, t, K.titleA, { dy: 50, blur: 8, end: K.outA });

      // ---- Part A
      const sh = prog(t, K.shield, 1.2, Ease.inOut);
      r.shield.style.opacity = prog(t, K.shield, 0.3);
      draw(r.shPath, sh);
      r.shFill.style.opacity = prog(t, K.shield + 0.8, 0.6);
      draw(r.lkArc, prog(t, K.shield + 0.7, 0.6));
      draw(r.lkBody, prog(t, K.shield + 0.6, 0.6));
      r.lkDot.style.opacity = prog(t, K.shield + 1.2, 0.3);
      const breathe = 1 + 0.02 * Math.sin(t * 2.4);
      r.shield.style.transform = `scale(${breathe.toFixed(4)})`;
      r.shield.style.filter = `drop-shadow(0 0 ${(18 + 10 * Math.sin(t * 2.4)).toFixed(1)}px rgba(60,255,142,.35))`;

      reveal(r.panel, t, K.panel, { dy: 70, scale: 0.97, dur: 0.9 });
      K.perms.forEach((s, i) => reveal(r["perm" + i], t, s, { dx: -24, dy: 0 }));
      PERMS.forEach((p, i) => {
        if (p.flip === undefined) return;
        const f = prog(t, K.flip[p.flip], 0.35, Ease.inOut);
        r["knob" + i].style.transform = `translateX(${lerp(44, 0, f).toFixed(1)}px)`;
        r["tg" + i].style.background = f > 0.5 ? "#3a3a3d" : "var(--green)";
      });
      reveal(r.consent, t, K.consent, { dy: 24 });
      reveal(r.checkA, t, K.checkA, { dy: 40, blur: 8 });
      reveal(r.partA, t, 0, { end: K.outA, dur: 0.01, dy: 0, outDur: 0.6 });

      // ---- Part B
      reveal(r.titleB, t, K.titleB, { dy: 50, blur: 8 });
      reveal(r.lender, t, K.lender, { dy: -40 });
      reveal(r.borrower, t, K.borrower, { dy: 40 });
      const fd = prog(t, K.flowDraw, 0.9, Ease.inOut);
      draw(r.fDown, fd); draw(r.fUp, prog(t, K.flowDraw + 0.4, 0.9, Ease.inOut));
      r.aDown.style.opacity = prog(t, K.flowDraw + 0.8, 0.3);
      r.aUp.style.opacity = prog(t, K.flowDraw + 1.2, 0.3);
      reveal(r.lDown, t, K.flowDraw + 0.5, { dx: 20, dy: 0 });
      reveal(r.lUp, t, K.flowDraw + 0.9, { dx: -20, dy: 0 });
      reveal(r.lDirect, t, K.flowDraw + 1.2, { scale: 0.85, dy: 0 });
      for (let i = 0; i < 4; i++) {
        const on = t > K.flowDraw + 1.2;
        const ph = (((t - K.flowDraw) * 0.42 + i / 4) % 1 + 1) % 1;
        const d = along(r.fDown, ph), u = along(r.fUp, ph);
        r["cd" + i].setAttribute("transform", `translate(${d.x} ${d.y})`);
        r["cu" + i].setAttribute("transform", `translate(${u.x} ${u.y})`);
        const a = on ? Math.min(1, Math.sin(Math.PI * ph) * 1.6) : 0;
        r["cd" + i].style.opacity = a; r["cu" + i].style.opacity = a;
      }
      reveal(r.platform, t, K.platform, { dy: 30, scale: 0.97 });
      K.lines.forEach((s, i) => reveal(r["ln" + i], t, s, { dx: -30, dy: 0 }));
      r.dim.style.opacity = (prog(t, K.scam, 0.5) * (1 - prog(t, K.scamOut, 0.5))).toFixed(3);
      reveal(r.scam, t, K.scam, { end: K.scamOut, dy: 30, scale: 0.9, ease: Ease.outBack });
      const st = prog(t, K.stamp, 0.35, Ease.outBack);
      r.stamp.style.opacity = Math.min(1, st * 1.5);
      r.stamp.style.transform = `rotate(8deg) scale(${lerp(2.2, 1, st).toFixed(3)})`;
      reveal(r.note, t, K.note, { dy: 20 });
    },
  });
})();
