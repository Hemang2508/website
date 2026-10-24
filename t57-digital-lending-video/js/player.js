/* ==========================================================================
   Boot + preview player.
   index.html                -> preview with playback controls
   index.html?render=1       -> bare 1080×1920 stage for the MP4 renderer
                                (exposes window.__seek / window.__total)
   index.html?t=42.5         -> open the preview at a given second
   ========================================================================== */
(function () {
  "use strict";
  const params = new URLSearchParams(location.search);
  const RENDER = params.has("render");
  const LS_KEY = "t57-timeline";

  function loadTimeline() {
    const base = window.TIMELINE.map((s) => ({ ...s }));
    if (RENDER) {
      // Renderer may inject custom timings via ?timings=<json>
      try { if (params.get("timings")) return mergeTimings(base, JSON.parse(params.get("timings"))); } catch (e) { /* ignore */ }
      return base;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (saved) return mergeTimings(base, saved);
    } catch (e) { /* storage unavailable */ }
    return base;
  }
  function mergeTimings(base, custom) {
    const map = Object.fromEntries((custom || []).map((s) => [s.id, +s.duration]));
    return base.map((s) => ({ ...s, duration: map[s.id] > 0 ? map[s.id] : s.duration }));
  }

  async function boot() {
    document.body.classList.add(RENDER ? "render" : "preview");
    try { await document.fonts.ready; } catch (e) { /* noop */ }
    const stage = document.getElementById("stage");
    engine.mount(stage, loadTimeline());

    if (RENDER) {
      window.__seek = (t) => engine.seek(t);
      window.__total = engine.total;
      window.__ready = true;
      return;
    }
    setupPlayer(stage);
  }

  function setupPlayer(stage) {
    const wrap = document.getElementById("stage-wrap");
    const ui = document.getElementById("player");
    ui.innerHTML = `
      <h1>T57 · Digital-Lending Safeguards<small>9:16 · 1080×1920 · silent animated explainer</small></h1>
      <div class="panel">
        <div class="row"><button class="primary" id="pp">▶ Play</button><button id="restart">⟲ Restart</button>
          <select id="speed"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select>
          <label class="note"><input type="checkbox" id="loop" checked> loop</label></div>
        <input type="range" id="scrub" min="0" step="0.01">
        <div class="row time"><span id="tc">0.00</span>&nbsp;/&nbsp;<span id="tt"></span>&nbsp;s</div>
        <div class="row" id="chips"></div>
        <div class="note">Keys: Space play/pause · ←/→ ±1 s · Shift+←/→ ±0.1 s · [ ] previous/next scene</div>
      </div>
      <div class="panel">
        <b>Scene timings (seconds)</b>
        <table id="timings"></table>
        <div class="row"><button id="apply">Apply</button><button id="reset">Reset to defaults</button><button id="copy">Copy JSON</button></div>
        <div class="note">Saved in this browser. To make a change permanent, and to use it in the MP4, paste the values into <code>js/timeline.js</code> (or pass them to the renderer with <code>--timings</code>).</div>
      </div>`;

    const $ = (id) => ui.querySelector("#" + id);
    let playing = false, last = 0, speed = 1;

    function fit() {
      const narrow = window.innerWidth <= 900;
      const availH = window.innerHeight - 40;
      const availW = narrow ? window.innerWidth - 40 : window.innerWidth - 460;
      const s = Math.max(0.15, Math.min(availH / 1920, availW / 1080));
      stage.style.transform = `scale(${s})`;
      wrap.style.width = 1080 * s + "px";
      wrap.style.height = 1920 * s + "px";
    }
    window.addEventListener("resize", fit);
    fit();

    function renderUI() {
      $("scrub").max = engine.total;
      $("tt").textContent = engine.total.toFixed(2);
      $("chips").innerHTML = engine.scenes.map((s, i) => `<button data-i="${i}">${String(i + 1).padStart(2, "0")} ${s.def.title}</button>`).join("");
      $("chips").querySelectorAll("button").forEach((b) => (b.onclick = () => { seek(engine.scenes[+b.dataset.i].start + 0.01); }));
      $("timings").innerHTML = engine.scenes.map((s) => `<tr><td>${String(s.index + 1).padStart(2, "0")} ${s.def.title}</td><td><input type="number" min="2" step="0.5" data-id="${s.def.id}" value="${s.duration}"></td></tr>`).join("") +
        `<tr><td><b>Total</b></td><td><b>${engine.total.toFixed(1)} s</b></td></tr>`;
    }
    function sync() {
      $("scrub").value = engine.t;
      $("tc").textContent = engine.t.toFixed(2);
      const ci = engine.sceneAt(engine.t).index;
      $("chips").querySelectorAll("button").forEach((b, i) => b.classList.toggle("active", i === ci));
    }
    function seek(t) { engine.seek(t); sync(); }
    function setPlaying(p) {
      playing = p;
      $("pp").textContent = p ? "❚❚ Pause" : "▶ Play";
      if (p) { if (engine.t >= engine.total) engine.seek(0); last = performance.now(); requestAnimationFrame(tick); }
    }
    function tick(now) {
      if (!playing) return;
      const dt = (now - last) / 1000; last = now;
      let t = engine.t + dt * speed;
      if (t >= engine.total) { if ($("loop").checked) t = 0; else { t = engine.total; setPlaying(false); } }
      seek(t);
      requestAnimationFrame(tick);
    }
    function currentTimings() {
      return [...$("timings").querySelectorAll("input")].map((i) => ({ id: i.dataset.id, duration: +i.value }));
    }

    $("pp").onclick = () => setPlaying(!playing);
    $("restart").onclick = () => { seek(0); setPlaying(true); };
    $("speed").onchange = (e) => (speed = +e.target.value);
    $("scrub").oninput = (e) => seek(+e.target.value);
    $("apply").onclick = () => {
      const tl = mergeTimings(window.TIMELINE.map((s) => ({ ...s })), currentTimings());
      try { localStorage.setItem(LS_KEY, JSON.stringify(tl)); } catch (e) { /* noop */ }
      engine.setTimeline(tl); renderUI(); sync();
    };
    $("reset").onclick = () => {
      try { localStorage.removeItem(LS_KEY); } catch (e) { /* noop */ }
      engine.setTimeline(window.TIMELINE.map((s) => ({ ...s }))); renderUI(); sync();
    };
    $("copy").onclick = () => {
      const json = JSON.stringify(currentTimings());
      (navigator.clipboard ? navigator.clipboard.writeText(json) : Promise.reject()).then(
        () => ($("copy").textContent = "Copied ✓"), () => prompt("Timings JSON:", json));
      setTimeout(() => ($("copy").textContent = "Copy JSON"), 1500);
    };
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" && e.target.type === "number") return;
      const step = e.shiftKey ? 0.1 : 1;
      if (e.code === "Space") { e.preventDefault(); setPlaying(!playing); }
      else if (e.key === "ArrowRight") seek(engine.t + step);
      else if (e.key === "ArrowLeft") seek(engine.t - step);
      else if (e.key === "]") { const s = engine.scenes[Math.min(engine.scenes.length - 1, engine.sceneAt(engine.t).index + 1)]; seek(s.start + 0.01); }
      else if (e.key === "[") { const s = engine.scenes[Math.max(0, engine.sceneAt(engine.t).index - 1)]; seek(s.start + 0.01); }
    });

    renderUI();
    seek(+params.get("t") || 0);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
