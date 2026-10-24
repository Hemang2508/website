/* SCENE 7: SOURCES
   Final reference card. TEXTBOOK is an editable placeholder: replace it with
   the verified bibliographic details, then re-render. */
(function () {
  const { reveal } = Anim;

  const TEXTBOOK = "[Author(s). (Year). <i>Title of prescribed textbook</i> (Edition). Publisher.] Insert verified details.";
  const IS_PLACEHOLDER = TEXTBOOK.trim().startsWith("[");

  const REFS = [
    "Reserve Bank of India, <i>Reserve Bank of India (Digital Lending) Directions, 2025</i>, dated 8 May 2025.",
    "Course notes: <i>FinTech, DeFi &amp; Digital Banking Platforms</i>.",
    "Prescribed textbook: " + TEXTBOOK,
  ];
  const K = { kicker: 0.3, title: 0.6, card: 1.2, refs: [1.9, 2.6, 3.3], disc: 4.4, sign: 5.2 };

  Scene.define("sources", {
    title: "Sources",
    base: 11,
    build(root) {
      root.innerHTML = `
        <div class="abs kicker" data-ref="kicker" style="left:80px;top:212px">REFERENCES</div>
        <div class="abs h2" data-ref="title" style="left:80px;top:262px">SOURCES</div>

        <div class="abs card" data-ref="card" style="left:80px;top:400px;width:920px;height:650px;padding:40px 46px">
          ${REFS.map((ref, i) => `
            <div data-ref="ref${i}" style="display:flex;gap:28px;padding:30px 0;${i < 2 ? "border-bottom:1.5px solid rgba(255,255,255,.08)" : ""}">
              <span style="flex:none;font:700 36px/1.3 var(--mono);color:var(--gold)">0${i + 1}</span>
              <div style="font:500 34px/1.45 var(--sans);color:var(--text);${i === 2 && IS_PLACEHOLDER ? "border:2px dashed rgba(226,184,75,.6);border-radius:16px;padding:18px 22px;background:rgba(226,184,75,.05)" : ""}">${ref}</div>
            </div>`).join("")}
        </div>

        <div class="abs small" data-ref="disc" style="left:80px;top:1100px;width:920px;font-size:26px">All app names, lenders, payment requests and loan figures shown are <b style="color:var(--text-2)">fictional and illustrative</b>. Educational content for T57, not financial or legal advice.</div>

        <div class="abs" data-ref="sign" style="left:80px;top:1300px;width:920px;display:flex;align-items:center;gap:22px">
          <span style="font:700 26px/1 var(--mono);color:#0a0a0a;background:var(--gold);padding:12px 18px;border-radius:10px;letter-spacing:.06em">T57</span>
          <span style="font:800 40px/1 var(--sans);letter-spacing:-.01em">DIGITAL-LENDING SAFEGUARDS</span>
        </div>
      `;
    },
    update(t, r) {
      reveal(r.kicker, t, K.kicker, { dx: -30, dy: 0 });
      reveal(r.title, t, K.title, { dy: 50, blur: 8 });
      reveal(r.card, t, K.card, { dy: 60, scale: 0.97, dur: 0.9 });
      K.refs.forEach((s, i) => reveal(r["ref" + i], t, s, { dx: -24, dy: 0 }));
      reveal(r.disc, t, K.disc, { dy: 20 });
      reveal(r.sign, t, K.sign, { dy: 30 });
    },
  });
})();
