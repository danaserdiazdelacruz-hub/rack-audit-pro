import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3d1f0a",
        accent: "#92400e",
        success: "#16a34a",
        warning: "#ca8a04",
        danger: "#dc2626",
        surface: "#e8ecf2",
        "surface-elevated": "#ffffff",
        "border-custom": "#c9d2de",
        "text-primary": "#0f172a",
        "text-secondary": "#64748b",
        "text-neutral": "#94a3b8",
        "area-pasillo": "#92400e",
        "area-ubicacion": "#1e40af",
        "area-producto": "#7e22ce",
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0,0,0,0.08)",
        "card-lg": "0 10px 15px -3px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        custom: "6px",
        "custom-lg": "10px",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease",
        slideIn: "slideIn 0.3s ease",
        slideUp: "slideUp 0.3s ease",
        selectPulse: "selectPulse 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        selectPulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
