import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        abyss: "#000000",
        "abyss-2": "#1C1C1C",
        deep: "#1C1C1C",
        "deep-2": "#333333",
        shelf: "#333333",
        tide: "#999999",
        seaglass: "#FFFFFF",
        brass: "#FFFFFF",

        virtus: {
          black: "#000000",
          white: "#FFFFFF",
          yellow: "#FBD227",
          orange: "#DD7230",
          brown: "#854D27",
        },

        tvl: {
          plum: "#0A0A0A",
          "plum-dark": "#000000",
          amber: "#FBD227",
          orange: "#DD7230",
          ochre: "#854D27",
          champagne: "#FCDB52",
        },
      },
      fontSize: {
        display: [
          "clamp(3rem, 1.4rem + 8vw, 7.5rem)",
          { lineHeight: "1", letterSpacing: "0.01em" },
        ],
        h1: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h2: [
          "2.5rem",
          { lineHeight: "1.15", letterSpacing: "-0.02em" },
        ],
        h3: ["1.75rem", { lineHeight: "1.2", letterSpacing: "0.02em" }],
        eyebrow: [
          "0.8125rem",
          { lineHeight: "1.2", letterSpacing: "0.1875em" },
        ],
        "body-lg": ["1.375rem", { lineHeight: "1.5" }],
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Black", "Arial", "sans-serif"],
        monument: ["var(--font-monument)", "Arial Black", "Arial", "sans-serif"],
        accent: ["var(--font-accent)", "Arial", "sans-serif"],
        wordmark: ["var(--font-wordmark)", "Arial Black", "Arial", "sans-serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
