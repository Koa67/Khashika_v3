import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2596be',
          dark: '#1e7a9a',
          light: '#3ab0d8',
        },
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#b8962f',
          light: '#e5c85c',
        },
        secondary: "#1a1a1a",
        accent: "#D4AF37",
        cream: "#F4EAD8",
        night: "#121A21",
        coral: '#FF6B6B',
        emerald: '#50C878',
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-karma)", "serif"],
        serif: ["var(--font-karma)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
