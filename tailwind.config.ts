import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Falcons Colors
        falcons: {
          red: "#A71930",
          "red-dark": "#8B1528",
          black: "#000000",
          silver: "#A5ACAF",
          white: "#FFFFFF",
        },
        // Extended Palette
        cream: "#F7F3ED",
        gold: {
          DEFAULT: "#C19A6B",
          accessible: "#8B6914",
        },
        // Status Colors
        success: "#2d6a4f",
        warning: "#e07b39",
        info: "#3d5a80",
        // Backgrounds
        bg: {
          dark: "#0a0a0a",
          card: "rgba(255, 255, 255, 0.05)",
        },
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        accent: ["Playfair Display", "serif"],
      },
      fontSize: {
        // Accessibility-focused sizes
        xs: ["16px", { lineHeight: "1.6" }],
        sm: ["18px", { lineHeight: "1.6" }],
        base: ["22px", { lineHeight: "1.6" }],
        lg: ["26px", { lineHeight: "1.5" }],
        xl: ["32px", { lineHeight: "1.4" }],
        "2xl": ["40px", { lineHeight: "1.3" }],
      },
      spacing: {
        // Touch-friendly sizes
        touch: "56px",
        "touch-sm": "48px",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(167, 25, 48, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
