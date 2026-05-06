import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — warm orange / cream / dark
        orange: "#F97316",
        "orange-dark": "#C2410C",
        "orange-deep": "#7C2D12",
        peach: "#FED7AA",
        cream: "#FFF7ED",
        sand: "#FEF3E2",
        amber: "#F59E0B",
        pearl: "#FFFFFF",
        ink: "#1C1917",
        graphite: "#292524",
        slate: "#78716C",
        smoke: "#A8A29E",
        line: "#E7E5E4",
        // Compatibility aliases (kept so older class refs still resolve)
        midnight: "#0C0A09",
        night: "#1C1917",
        royal: "#9A3412",
        magic: "#F97316",
        lavender: "#FED7AA",
        mist: "#FFF7ED",
        gold: "#F59E0B",
        rose: "#EA580C",
        coral: "#F97316",
        sky: "#3B82F6",
        emerald: "#10B981",
        "wood-dark": "#1C1917",
        "wood-medium": "#C2410C",
        "wood-light": "#FED7AA",
        "leaf-green": "#10B981",
        "sky-blue": "#3B82F6",
        "cloud-white": "#FFFFFF",
        "text-dark": "#1C1917",
        "text-light": "#78716C",
      },
      fontFamily: {
        display: ['"Inter"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(194, 65, 12, 0.06), 0 6px 18px -6px rgba(194, 65, 12, 0.14)",
        lift: "0 8px 16px -6px rgba(194, 65, 12, 0.12), 0 22px 40px -14px rgba(194, 65, 12, 0.22)",
        glow: "0 0 30px rgba(249, 115, 22, 0.35)",
        "glow-orange": "0 0 30px rgba(249, 115, 22, 0.45)",
        "glow-amber": "0 0 30px rgba(245, 158, 11, 0.4)",
        toy: "0 1px 2px rgba(194, 65, 12, 0.06), 0 6px 18px -6px rgba(194, 65, 12, 0.14)",
        "toy-lg": "0 8px 16px -6px rgba(194, 65, 12, 0.12), 0 22px 40px -14px rgba(194, 65, 12, 0.22)",
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        float: "float 4s ease-in-out infinite",
        twinkle: "twinkle 2.4s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
