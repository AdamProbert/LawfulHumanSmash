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
          50: "#FFFDF7",
          100: "#FDF6E3",
          200: "#F5ECD7",
          300: "#EDE0C8",
        },
        ivy: {
          DEFAULT: "#2D5016",
          dark: "#1B3A1A",
          light: "#3B6B24",
        },
        leaf: {
          DEFAULT: "#4A7C2E",
          light: "#5C9A38",
          pale: "#7AB856",
        },
        accent: {
          orange: "#D4760A",
          "orange-light": "#E8941E",
          burgundy: "#722F37",
          yellow: "#E6B422",
          purple: "#6B3FA0",
          red: "#9B2335",
        },
        gold: {
          dark: "#A88734",
          DEFAULT: "#C9A84C",
          light: "#D4B96A",
          pale: "#E8D5A0",
        },
        parchment: {
          DEFAULT: "#F5ECD7",
          light: "#FBF5EA",
          dark: "#E8D5B0",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel-decorative)", "serif"],
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-cormorant)", "serif"],
      },
      backgroundImage: {
        "art-nouveau-gradient":
          "linear-gradient(135deg, #1B3A1A 0%, #2D5016 30%, #4A7C2E 70%, #3B6B24 100%)",
        "gold-shimmer":
          "linear-gradient(90deg, #A88734, #C9A84C, #D4B96A, #C9A84C, #A88734)",
        "parchment-gradient":
          "linear-gradient(180deg, #FDF6E3 0%, #F5ECD7 50%, #EDE0C8 100%)",
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
