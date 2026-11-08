import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#111C30",
          950: "#0A1120",
          900: "#111C30",
          800: "#1C2A44",
          700: "#2A3A58",
        },
        brand: {
          DEFAULT: "#6657CE",
          50: "#F2F0FC",
          100: "#E5E1F9",
          200: "#CBC4F2",
          300: "#A89DE6",
          400: "#8577DA",
          500: "#6657CE",
          600: "#5444BC",
          700: "#46389C",
          800: "#382D7C",
        },
        teal: {
          DEFAULT: "#13A69A",
          50: "#E8F7F5",
          100: "#C9EEEA",
          200: "#93DDD5",
          400: "#2FBCAF",
          500: "#13A69A",
          600: "#0F887E",
          700: "#0C6D65",
        },
        canvas: "#F5F6FA",
        ink: {
          DEFAULT: "#111C30",
          muted: "#5B6478",
          subtle: "#8A92A6",
        },
        line: "#E4E7EF",
      },
      fontFamily: {
        sans: ["'Inter Variable'", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,28,48,0.04), 0 1px 3px rgba(17,28,48,0.06)",
        lift: "0 4px 12px -2px rgba(17,28,48,0.08), 0 2px 4px -2px rgba(17,28,48,0.05)",
        pop: "0 16px 40px -12px rgba(17,28,48,0.25)",
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem" },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: { "fade-in": "fade-in .2s ease-out" },
    },
  },
  plugins: [],
};
export default config;
