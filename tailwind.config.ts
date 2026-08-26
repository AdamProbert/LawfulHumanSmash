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
          DEFAULT: "#3E5E34",
          dark: "#263A1E",
          light: "#557B45",
        },
        leaf: {
          DEFAULT: "#5F7E3F",
          light: "#7E9C57",
          pale: "#B9CCA1",
        },
        emerald: {
          DEFAULT: "#3E5E34",
          dark: "#263A1E",
          light: "#557B45",
        },
        terracotta: {
          DEFAULT: "#C4552B",
          light: "#DB7648",
          dark: "#9C3D1C",
        },
        brown: {
          DEFAULT: "#6B4A2B",
          light: "#8A6440",
          dark: "#4E3520",
        },
        accent: {
          orange: "#C4552B",
          "orange-light": "#DB7648",
          burgundy: "#7A2E3A",
          yellow: "#DDA22B",
          red: "#9B2335",
        },
        gold: {
          dark: "#6F5122",
          DEFAULT: "#9C7833",
          light: "#C29A48",
          pale: "#E2CE9C",
        },
        parchment: {
          DEFAULT: "#E8E6DA",
          light: "#F0EEE3",
          dark: "#D9D7CB",
        },
      },
      fontFamily: {
        display: ["'Rivanna'", "serif"],
        heading: ["'Rivanna'", "serif"],
        body: ["var(--font-merriweather)", "Merriweather", "serif"],
      },
      backgroundImage: {
        "art-nouveau-gradient":
          "linear-gradient(135deg, #263A1E 0%, #3E5E34 30%, #557B45 70%, #5F7E3F 100%)",
        "gold-shimmer":
          "linear-gradient(90deg, #6F5122, #9C7833, #C29A48, #9C7833, #6F5122)",
        "parchment-gradient":
          "linear-gradient(180deg, #EAE8DC 0%, #E2E0D4 50%, #D9D7CB 100%)",
        "jewel-gradient":
          "linear-gradient(135deg, #263A1E 0%, #3E5E34 45%, #C4552B 100%)",
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
