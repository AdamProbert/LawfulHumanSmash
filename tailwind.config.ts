import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#F5F3E8",
          100: "#EAE8DC",
          200: "#E2E0D4",
          300: "#D9D7CB",
        },
        ivy: {
          DEFAULT: "#7A5B30",
          dark: "#523D1E",
          light: "#96743A",
        },
        leaf: {
          DEFAULT: "#8B6830",
          light: "#A88040",
          pale: "#C0985A",
        },
        accent: {
          orange: "#D4760A",
          "orange-light": "#E8941E",
          burgundy: "#722F37",
          yellow: "#E6B422",
          red: "#9B2335",
        },
        gold: {
          dark: "#A88734",
          DEFAULT: "#C9A84C",
          light: "#D4B96A",
          pale: "#E8D5A0",
        },
        parchment: {
          DEFAULT: "#E8E6DA",
          light: "#F0EEE3",
          dark: "#D9D7CB",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel-decorative)", "serif"],
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-cormorant)", "serif"],
      },
      backgroundImage: {
        "art-nouveau-gradient":
          "linear-gradient(135deg, #523D1E 0%, #7A5B30 30%, #96743A 70%, #8B6830 100%)",
        "gold-shimmer":
          "linear-gradient(90deg, #A88734, #C9A84C, #D4B96A, #C9A84C, #A88734)",
        "parchment-gradient":
          "linear-gradient(180deg, #EAE8DC 0%, #E2E0D4 50%, #D9D7CB 100%)",
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "unfurl": "unfurl 1.2s ease-out forwards",
        "float": "float 4s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        unfurl: {
          "0%": { maxHeight: "0", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { maxHeight: "2000px", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 168, 76, 0.4)" },
          "50%": { boxShadow: "0 0 20px 10px rgba(201, 168, 76, 0.1)" },
        },
      },
      borderRadius: {
        art: "2px 16px 2px 16px",
      },
    },
  },
  plugins: [],
};

export default config;
