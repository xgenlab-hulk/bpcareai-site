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
        // BPCare AI brand colors from iOS app
        brand: {
          blue: {
            light: "#D9F2FF",
            DEFAULT: "#85C1E9",
            dark: "#1F3A57",
          },
          purple: {
            light: "#F2E6FF",
            DEFAULT: "#B19CD9",
            dark: "#2D1F3D",
          },
          pink: {
            light: "#FFEBF2",
            DEFAULT: "#E8B4D9",
            dark: "#3D1F2D",
          },
        },
        // Semantic colors
        heart: "#EF4444",
        success: "#10B981",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #D9F2FF 0%, #F2E6FF 50%, #FFEBF2 100%)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
