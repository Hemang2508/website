import type { Config } from "tailwindcss";

/**
 * RTG Live design tokens. Colour values mirror the CSS variables in src/app/globals.css.
 * Token names (navy, brand, teal, canvas, ink, line) are kept from v1 so every existing
 * component picks up the new system without changing its markup semantics.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#10172A", // primary dark
          950: "#0A0F1E",
          900: "#10172A",
          800: "#17223B", // secondary dark
          700: "#24304D",
          600: "#34416A",
        },
        brand: {
          DEFAULT: "#6558E8",
          50: "#F1F0FE",
          100: "#E4E1FC",
          200: "#C9C3F8",
          300: "#A69CF2",
          400: "#857AEE",
          500: "#6558E8",
          600: "#5444D6",
          700: "#4536B3",
          800: "#382C8F",
        },
        teal: {
          DEFAULT: "#19B8A6",
          50: "#E8F8F6",
          100: "#C8EEE9",
          200: "#93DED5",
          400: "#2FC8B6",
          500: "#19B8A6",
          600: "#11907F", // used for white-text surfaces (AA contrast)
          700: "#0D7366",
        },
        canvas: "#F5F3EF", // primary light background (warm)
        sand: "#EDE9E2",
        ink: { DEFAULT: "#172033", muted: "#697386", subtle: "#737A89" },
        line: "#E6E2DA",
      },
      fontFamily: {
        sans: ["'Inter Variable'", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["'Instrument Serif'", "ui-serif", "Georgia", "serif"],
        display: ["'Plus Jakarta Sans Variable'", "'Inter Variable'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        poster: ["clamp(3.4rem, 10.5vw, 10.5rem)", { lineHeight: "0.9", letterSpacing: "-0.055em", fontWeight: "700" }],
        "display-xl": ["clamp(2.75rem, 6vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "700" }],
        "display-lg": ["clamp(2.1rem, 4vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-md": ["clamp(1.6rem, 2.6vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],
      },
      spacing: { 18: "4.5rem", 22: "5.5rem", section: "6.5rem" },
      maxWidth: { page: "80rem", prose: "42rem" },
      borderRadius: { xl: "0.875rem", "2xl": "1.25rem", "3xl": "1.75rem" },
      boxShadow: {
        card: "0 1px 2px rgba(16,23,42,0.04), 0 2px 8px -2px rgba(16,23,42,0.06)",
        lift: "0 12px 32px -12px rgba(16,23,42,0.18), 0 4px 8px -4px rgba(16,23,42,0.06)",
        pop: "0 24px 60px -18px rgba(16,23,42,0.35)",
        glow: "0 10px 30px -10px rgba(101,88,232,0.55)",
      },
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)" },
      transitionDuration: { fast: "180ms", base: "260ms", slow: "480ms" },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "none" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.97) translateY(8px)" }, to: { opacity: "1", transform: "none" } },
        "grow-y": { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
        "grow-x": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "word-up": { from: { transform: "translateY(110%)" }, to: { transform: "translateY(0)" } },
        "page-in": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "none" } },
        "draw": { from: { strokeDashoffset: "var(--len, 1000)" }, to: { strokeDashoffset: "0" } },
        "pin-drop": { "0%": { opacity: "0", transform: "translateY(-14px) scale(0.6)" }, "70%": { opacity: "1", transform: "translateY(2px) scale(1.05)" }, "100%": { opacity: "1", transform: "none" } },
        "meet-l": { from: { transform: "translateX(-28px)", opacity: "0" }, to: { transform: "none" } },
        "meet-r": { from: { transform: "translateX(28px)", opacity: "0" }, to: { transform: "none" } },
        "ring": { from: { opacity: "0.6", transform: "scale(0.6)" }, to: { opacity: "0", transform: "scale(2.4)" } },
      },
      animation: {
        "fade-in": "fade-in 220ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-up": "fade-up 560ms cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 260ms cubic-bezier(0.22,1,0.36,1) both",
        "grow-y": "grow-y 600ms cubic-bezier(0.22,1,0.36,1) both",
        "grow-x": "grow-x 600ms cubic-bezier(0.22,1,0.36,1) both",
        "word-up": "word-up 760ms cubic-bezier(0.22,1,0.36,1) both",
        "page-in": "page-in 280ms cubic-bezier(0.22,1,0.36,1) both",
        draw: "draw 1400ms cubic-bezier(0.22,1,0.36,1) both",
        "pin-drop": "pin-drop 620ms cubic-bezier(0.22,1,0.36,1) both",
        ring: "ring 1600ms cubic-bezier(0.22,1,0.36,1) 1 both",
      },
    },
  },
  plugins: [],
};
export default config;
