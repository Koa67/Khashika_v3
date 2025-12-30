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
        // Nouvelle palette Khashika
        primary: {
          DEFAULT: '#8B4E4E',  // Terre cuite (CTAs)
          dark: '#6B3D3D',
          light: '#A66B6B',
        },
        gold: {
          DEFAULT: '#E8B71B',  // Or plus visible
          dark: '#A8871F',
          light: '#DCBA3D',
        },
        secondary: "#2D2420",  // Brun foncé (texte)
        accent: "#E8B71B",     // OR
        cream: "#F5EDE6",      // Fond principal
        sand: "#EDE4DB",       // Fond cards/sidebar
        night: "#2D2420",
        coral: '#8B4E4E',      // Remplace l'ancien coral
        emerald: '#6B5B52',    // Brun moyen
        background: "#F5EDE6",
        foreground: "#2D2420",
        card: "#EDE4DB",
        "card-foreground": "#2D2420",
        border: "#E8B71B",
      },
      fontFamily: {
        sans: ["var(--font-arimo)", "sans-serif"],
        serif: ["var(--font-arimo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
