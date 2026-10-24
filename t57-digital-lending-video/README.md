# T57 · Digital-Lending Safeguards: silent animated explainer

Course: *FinTech, DeFi & Digital Banking Platforms*. Vertical **9:16, 1080 × 1920, 30 fps, 109 s**. The video uses only animated visuals and on-screen text. It has no presenter, voiceover, music or audio track.

**Finished video:** `output/T57-digital-lending-safeguards.mp4` (H.264, yuv420p, no audio stream).

## Preview and edit

Open `index.html` in Chrome or Edge. Double-clicking it works, and so does `npx serve .`. The panel next to the 9:16 stage has these controls:

- Play / pause, restart, speed and a scrubber. Keys: Space, ←/→ (±1 s), Shift+←/→ (±0.1 s), `[` `]` (previous/next scene).
- Scene chips that jump to any scene.
- **Scene timings**: change a scene's duration and press Apply. That scene's animation stretches or compresses to fit, and the setting is saved in your browser. To use the new timings in the MP4, copy them into `js/timeline.js`, or pass them with `--timings` (see below).

| Scene | File | Default |
|---|---|---|
| 01 Hook | `js/scenes/01-hook.js` | 13 s |
| 02 Identify the lender | `js/scenes/02-lender.js` | 16 s |
| 03 Understand the cost | `js/scenes/03-cost.js` | 20 s |
| 04 Data & fund flows | `js/scenes/04-data.js` | 21 s |
| 05 Accountability | `js/scenes/05-accountability.js` | 15 s |
| 06 Conclusion | `js/scenes/06-conclusion.js` | 13 s |
| 07 Sources | `js/scenes/07-sources.js` | 11 s |

Each scene file holds its own markup (`build`), a `K` table of keyframes in seconds, and an `update(t)` function. Colours and type are defined in `css/style.css`. The engine (`js/engine.js`) renders every frame as a pure function of time, so the preview and the export match frame for frame.

**Textbook reference:** no textbook details have been verified, so the video shows only a placeholder (`[Details to be added: …]`). Edit the `TEXTBOOK` constant at the top of `js/scenes/07-sources.js` with the verified citation and re-render. While the text starts with `[`, it shows as a dashed placeholder box.

## Export to MP4

Requirements: Node 18+, FFmpeg on your PATH, and Playwright with Chromium.

```bash
npm install                 # installs playwright
npx playwright install chromium
node render/render.mjs      # → output/T57-digital-lending-safeguards.mp4
```

Options:

- `--fps 60`
- `--workers 4` (parallel browser pages)
- `--crf 16` (quality; lower is better)
- `--from 30 --to 50 --out output/clip.mp4`
- `--stills 5,23,47` (PNG review frames)
- `--timings '[{"id":"cost","duration":22}]'`

The renderer captures each frame with headless Chromium and encodes it with `libx264 -pix_fmt yuv420p -an`, which gives broad compatibility (LinkedIn, Instagram, QuickTime) and no audio track.

## Content notes

- All app names, lenders, the payment request and the loan figures are **fictional**. Each mock interface carries an "ILLUSTRATIVE EXAMPLE" label.
- The loan example uses ₹50,000 at 18% p.a. (reducing balance), 12 EMIs of ₹4,584, and a ₹1,180 fee (₹1,000 + 18% GST). The fee is deducted upfront, giving a net disbursal of ₹48,820. Total repayments are 12 × ₹4,584 = ₹55,008. Interest is ₹5,008, and the cost of credit is ₹5,008 + ₹1,180 = ₹6,188 (= ₹55,008 − ₹48,820). The APR is 22.63% ≈ 22.6% p.a., computed as the monthly IRR × 12 on the net amount. The on-screen repayment schedule sums exactly to these figures.
- Regulatory points follow the *Reserve Bank of India (Digital Lending) Directions, 2025* (8 May 2025): regulated entity vs DLA/LSP roles, KFS and APR disclosure, no fees outside the KFS, cooling-off period, need-based data collection with consent, revocation and deletion, direct fund flows between borrower and RE accounts with no pass-through or pool accounts (specified exceptions apply), the RE remaining responsible under outsourcing, grievance redressal (30 days, then RB-IOS), and RBI's public DLA directory. Verify the details against the official text before submission.

Fonts: Inter and JetBrains Mono (SIL OFL 1.1). The licences are in `assets/fonts/`.
