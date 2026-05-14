import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#0E0E0C",
          soft: "#4A4A47",
          mute: "#8A8A85",
        },
        line: "#E8E7E2",
        accent: "#1F1F1D",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontWeight: {
        thin: "200",
        light: "300",
      },
      letterSpacing: {
        brand: "-0.02em",
      },
      borderRadius: {
        squircle: "22%",
      },
      boxShadow: {
        soft: "0 1px 0 rgba(14, 14, 12, 0.04), 0 8px 24px -12px rgba(14, 14, 12, 0.08)",
        ring: "0 0 0 1px rgba(14, 14, 12, 0.06)",
      },
      maxWidth: {
        prose: "62ch",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
