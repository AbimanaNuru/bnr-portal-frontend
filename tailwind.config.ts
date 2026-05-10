import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/core/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/design-system/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        // 🔥 CORE SYSTEM (mapped to CSS variables)
        // primary: "var(--color-primary)",
        // "primary-hover": "var(--color-primary-hover)",
        // "primary-active": "var(--color-primary-active)",
        // "primary-soft": "var(--color-primary-soft)",

        // accent: "var(--color-accent)",
        // "accent-soft": "var(--color-accent-soft)",

        // TEXT
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },

        // BACKGROUND
        bg: {
          app: "var(--color-bg-app)",
          card: "var(--color-bg-card)",
          elevated: "var(--color-bg-elevated)",
          hover: "var(--color-bg-hover)",
        },

        // BORDER
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },

        // SEMANTIC
        success: "var(--color-success)",
        "success-soft": "var(--color-success-soft)",

        warning: "var(--color-warning)",
        "warning-soft": "var(--color-warning-soft)",

        error: "var(--color-error)",
        "error-soft": "var(--color-error-soft)",

        info: "var(--color-info)",
        "info-soft": "var(--color-info-soft)",
      },

      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },

      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        xxl: "32px",
      },

      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 10px rgba(0,0,0,0.08)",
        lg: "0 10px 25px rgba(0,0,0,0.12)",
      },

      backgroundImage: {
        radial: "radial-gradient(var(--tw-gradient-stops))",
        conic: "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },

  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
  ],
};

export default config;