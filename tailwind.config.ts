import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Falcons Colors
        falcons: {
          red: "#A71930",
          "red-dark": "#8B1528",
          "red-light": "#C42339",
          black: "#000000",
          silver: "#A5ACAF",
          white: "#FFFFFF",
        },
        // Light mode backgrounds
        light: {
          bg: "#FAFAFA",
          card: "#FFFFFF",
          surface: "#F5F5F5",
          muted: "#E5E5E5",
        },
        // Dark mode backgrounds (Spotify/Lightroom inspired)
        dark: {
          bg: "#0A0A0A",
          card: "#181818",
          surface: "#1E1E1E",
          elevated: "#282828",
          muted: "#404040",
        },
        // Extended Palette
        cream: "#F7F3ED",
        gold: {
          DEFAULT: "#C19A6B",
          accessible: "#8B6914",
        },
        // Status Colors
        success: {
          DEFAULT: "#2d6a4f",
          light: "#40916c",
        },
        warning: {
          DEFAULT: "#e07b39",
          light: "#f4a261",
        },
        info: {
          DEFAULT: "#3d5a80",
          light: "#4a6fa5",
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
        base: ["20px", { lineHeight: "1.6" }],
        lg: ["24px", { lineHeight: "1.5" }],
        xl: ["28px", { lineHeight: "1.4" }],
        "2xl": ["36px", { lineHeight: "1.3" }],
        "3xl": ["48px", { lineHeight: "1.2" }],
        "4xl": ["60px", { lineHeight: "1.1" }],
      },
      spacing: {
        // Touch-friendly sizes
        touch: "56px",
        "touch-sm": "48px",
        "touch-lg": "64px",
      },
      borderRadius: {
        card: "16px",
        "card-lg": "24px",
      },
      boxShadow: {
        glow: "0 0 30px rgba(167, 25, 48, 0.4)",
        "glow-sm": "0 0 15px rgba(167, 25, 48, 0.3)",
        card: "0 4px 20px rgba(0, 0, 0, 0.1)",
        "card-dark": "0 4px 30px rgba(0, 0, 0, 0.5)",
        hero: "inset 0 -100px 100px -100px rgba(0, 0, 0, 0.8)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(167, 25, 48, 0.1) 0%, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
