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
        // Original Virtus Colors
        abyss: "#0F1B2A",
        "abyss-2": "#1C2639",
        deep: "#1C2639",
        "deep-2": "#435A76",
        shelf: "#435A76",
        tide: "#798DA8",
        seaglass: "#E0E1DC",
        brass: "#E0E1DC",

        // The Virtus Labs Brand Colors
        tvl: {
          plum: "#2E1F27",
          "plum-dark": "#1F141A",
          amber: "#F4C05D",
          orange: "#DD7230",
          ochre: "#854D27",
          champagne: "#E7E393",
        },
      },
      fontFamily: {
        display: ["var(--font-monument)", "var(--font-display)", "sans-serif"],
        monument: ["var(--font-monument)", "sans-serif"],
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
