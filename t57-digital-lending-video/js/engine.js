/* ==========================================================================
   Animation engine
   --------------------------------------------------------------------------
   Everything on screen is a pure function of time: engine.seek(t) sets every
   style for second t. No CSS transitions and no requestAnimationFrame state.
   That makes preview scrubbing exact, and it means every exported frame can
   be reproduced.

   Scenes register themselves with Scene.define(id, {...}) (see js/scenes/).
   The order and duration of the scenes come from js/timeline.js.
   ========================================================================== */
(function () {
  "use strict";

  // ---------- maths & easing ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const Ease = {
    linear: (t) => t,
    out: (t) => 1 - Math.pow(1 - t, 3),
    outQuint: (t) => 1 - Math.pow(1 - t, 5),
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outBack: (t) => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  };
  /** 0→1 progress of a tween that starts at `start` and lasts `dur` seconds. */
  const prog = (t, start, dur, ease = Ease.out) => ease(clamp((t - start) / dur));

  /**
   * Standard enter/exit used for almost every element so the motion language
   * stays consistent: fade + slide in, optional fade + lift out.
   */
  function reveal(el, t, start, o = {}) {
    if (!el) return 0;
    const { end = Infinity, dur = 0.7, dy = 36, dx = 0, scale = 1, outDur = 0.5, blur = 0 } = o;
    const pi = prog(t, start, dur, o.ease || Ease.outQuint);
    const po = end === Infinity ? 0 : prog(t, end, outDur, Ease.inOut);
    const a = pi * (1 - po);
    el.style.opacity = a.toFixed(4);
    el.style.visibility = a <= 0.001 ? "hidden" : "visible";
    const s = lerp(scale, 1, pi);
    el.style.transform = `translate(${(dx * (1 - pi)).toFixed(2)}px, ${(dy * (1 - pi) - 18 * po).toFixed(2)}px) scale(${s.toFixed(4)})`;
    if (blur) el.style.filter = `blur(${(blur * (1 - pi)).toFixed(2)}px)`;
    return a;
  }

  /** Draws an SVG path/line/circle from 0 to p (0..1) using stroke-dash. */
  function draw(el, p) {
    if (!el) return;
    let len = +el.dataset.len;
    if (!len) { len = el.getTotalLength(); el.dataset.len = len; }
    el.style.strokeDasharray = `${len} ${len}`;
    el.style.strokeDashoffset = (len * (1 - clamp(p))).toFixed(2);
  }

  /** Moves an element (via translate) to the point at fraction p along an SVG path. */
  function along(path, p) {
    let len = +path.dataset.len;
    if (!len) { len = path.getTotalLength(); path.dataset.len = len; }
    return path.getPointAtLength(len * clamp(p));
  }

  /** Reveals text character by character. */
  function type(el, text, p) {
    const n = Math.round(text.length * clamp(p));
    const s = text.slice(0, n);
    if (el.textContent !== s) el.textContent = s;
  }

  const fmtINR = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

  // ---------- icon set (stroke icons, 48×48 viewbox) ----------
  const sv = (d, extra = "") => (size = 56, color = "currentColor", sw = 2.6) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const Icons = {
    bank: sv(`<path d="M6 18 24 7l18 11"/><path d="M8 18h32"/><path d="M12 22v13M20 22v13M28 22v13M36 22v13"/><path d="M7 39h34"/>`),
    phone: sv(`<rect x="13" y="5" width="22" height="38" rx="5"/><path d="M21 37h6"/><path d="M19 10h10"/>`),
    user: sv(`<circle cx="24" cy="16" r="8"/><path d="M8 42c2-9 8.5-13 16-13s14 4 16 13"/>`),
    shield: sv(`<path d="M24 5 9 11v11c0 10 6.5 17.5 15 21 8.5-3.5 15-11 15-21V11z"/>`),
    lock: sv(`<rect x="10" y="21" width="28" height="21" rx="4"/><path d="M16 21v-6a8 8 0 0 1 16 0v6"/><path d="M24 29v5"/>`),
    doc: sv(`<path d="M12 5h17l9 9v29H12z"/><path d="M29 5v9h9"/><path d="M18 24h14M18 30h14M18 36h9"/>`),
    check: sv(`<path d="M10 25l9 9 19-20"/>`),
    x: sv(`<path d="M13 13l22 22M35 13 13 35"/>`),
    warn: sv(`<path d="M24 6 3 42h42z"/><path d="M24 19v11"/><path d="M24 36v.5"/>`),
    headset: sv(`<path d="M8 28v-4a16 16 0 0 1 32 0v4"/><rect x="6" y="27" width="8" height="12" rx="3"/><rect x="34" y="27" width="8" height="12" rx="3"/><path d="M38 39c0 3-3 4-8 4h-4"/>`),
    chat: sv(`<path d="M7 9h34v23H22l-9 8v-8H7z"/><path d="M15 18h18M15 24h12"/>`),
    folder: sv(`<path d="M5 13h14l4 5h20v22H5z"/>`),
    contacts: sv(`<rect x="9" y="6" width="30" height="36" rx="4"/><circle cx="24" cy="20" r="5"/><path d="M16 34c1.5-4 4.5-6 8-6s6.5 2 8 6"/>`),
    call: sv(`<path d="M14 6h-4a4 4 0 0 0-4 4c0 17 15 32 32 32a4 4 0 0 0 4-4v-4l-8-4-4 4c-5-2-10-7-12-12l4-4z"/>`),
    camera: sv(`<path d="M6 15h9l3-5h12l3 5h9v24H6z"/><circle cx="24" cy="26" r="7"/>`),
    pin: sv(`<path d="M24 43s13-12 13-23a13 13 0 0 0-26 0c0 11 13 23 13 23z"/><circle cx="24" cy="20" r="4.5"/>`),
    rupee: sv(`<path d="M14 8h20M14 16h20M14 8c11 0 13 4 13 8s-4 9-13 9l14 15"/>`),
  };

  // ---------- scene registry ----------
  const registry = {};
  const Scene = {
    define(id, def) { registry[id] = Object.assign({ id }, def); },
    get: (id) => registry[id],
  };

  // ---------- engine ----------
  const FADE = 0.45; // scene-to-scene dip-to-black, seconds (each side)

  const engine = {
    scenes: [],
    total: 0,
    t: 0,

    mount(stage, timeline) {
      this.stage = stage;
      this.bg = stage.querySelector("#bg");
      this.layer = stage.querySelector("#scenes");
      this.chrome = stage.querySelector("#chrome");
      this.setTimeline(timeline);
    },

    setTimeline(timeline) {
      this.layer.innerHTML = "";
      let start = 0;
      this.scenes = timeline.map((item, i) => {
        const def = Scene.get(item.id);
        if (!def) throw new Error("Unknown scene id: " + item.id);
        const root = document.createElement("div");
        root.className = "scene scene-" + item.id;
        root.style.display = "none";
        this.layer.appendChild(root);
        def.build(root);
        const s = { def, root, index: i, start, duration: item.duration, refs: {} };
        root.querySelectorAll("[data-ref]").forEach((el) => (s.refs[el.dataset.ref] = el));
        start += item.duration;
        return s;
      });
      this.total = start;
      this.buildChrome();
      this.seek(this.t);
    },

    buildChrome() {
      const n = this.scenes.length;
      this.chrome.innerHTML = `
        <div class="hdr"><span class="pill">T57</span><span class="ttl">DIGITAL-LENDING SAFEGUARDS</span><span class="num"><b>01</b> / ${String(n).padStart(2, "0")}</span></div>
        <div class="bar">${this.scenes.map(() => "<div class='seg'><i></i></div>").join("")}</div>
        <div class="ftr"><span>FINTECH, DEFI &amp; DIGITAL BANKING PLATFORMS</span><span></span></div>`;
      this.chromeNum = this.chrome.querySelector(".num b");
      this.chromeSegs = [...this.chrome.querySelectorAll(".seg i")];
      this.chromeScene = this.chrome.querySelector(".ftr span:last-child");
    },

    sceneAt(t) {
      for (const s of this.scenes) if (t < s.start + s.duration) return s;
      return this.scenes[this.scenes.length - 1];
    },

    seek(t) {
      t = clamp(t, 0, this.total);
      this.t = t;
      const cur = this.sceneAt(t);
      for (const s of this.scenes) {
        if (s !== cur) { if (s.root.style.display !== "none") s.root.style.display = "none"; continue; }
        s.root.style.display = "block";
        const local = t - s.start;
        const isLast = s.index === this.scenes.length - 1;
        // Scene timings are authored against def.base seconds; stretch to the
        // duration chosen in the timeline so durations are freely editable.
        const bt = local * (s.def.base / s.duration);
        s.def.update(bt, s.refs, s.root);
        const fin = s.index === 0 ? prog(local, 0, 0.6) : prog(local, 0, FADE);
        const fout = 1 - prog(local, s.duration - (isLast ? 0.9 : FADE), isLast ? 0.9 : FADE, Ease.inOut);
        const zoom = 1 + 0.022 * (local / s.duration); // slow push-in
        s.root.style.opacity = Math.min(fin, fout).toFixed(4);
        s.root.style.transform = `scale(${(zoom - 0.012 * (1 - fin)).toFixed(5)})`;
      }
      // chrome
      const ci = cur.index;
      this.chromeNum.textContent = String(ci + 1).padStart(2, "0");
      this.chromeScene.textContent = (cur.def.title || "").toUpperCase();
      this.chromeSegs.forEach((seg, i) => {
        const s = this.scenes[i];
        const p = i < ci ? 1 : i > ci ? 0 : clamp((t - s.start) / s.duration);
        seg.style.width = (p * 100).toFixed(2) + "%";
      });
      const endFade = 1 - prog(t, this.total - 0.9, 0.9, Ease.inOut);
      this.chrome.style.opacity = (prog(t, 0.2, 0.8) * endFade).toFixed(4);
      // ambient background drift
      const g = this.bg.querySelector(".grid"), gg = this.bg.querySelector(".glow.gold"), gr = this.bg.querySelector(".glow.green");
      g.style.transform = `translate(${(-(t * 6) % 60).toFixed(2)}px, ${(-(t * 10) % 60).toFixed(2)}px)`;
      gg.style.transform = `translate(${(520 + Math.sin(t * 0.21) * 90).toFixed(1)}px, ${(-260 + Math.cos(t * 0.17) * 70).toFixed(1)}px)`;
      gr.style.transform = `translate(${(-320 + Math.cos(t * 0.13) * 80).toFixed(1)}px, ${(1300 + Math.sin(t * 0.19) * 90).toFixed(1)}px)`;
    },
  };

  window.Anim = { clamp, lerp, Ease, prog, reveal, draw, along, type, fmtINR, Icons };
  window.Scene = Scene;
  window.engine = engine;
})();
