/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#050505",
          light: "#0a0a0a",
        },
        purple: {
          electric: "#8A2BE2",
          glow: "#9D4EDD",
          dark: "#6B21A8",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(138, 43, 226, 0.3)",
        "glow-purple-lg": "0 0 40px rgba(138, 43, 226, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(138, 43, 226, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(138, 43, 226, 0.6)" },
        },
      },
      fontFamily: {
        vibes: ["Lobster", "sans-serif"],
      }
    },
  },
  plugins: [],
};
