import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        brass: "hsl(var(--brass))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        // Extra tokens both themes define (see src/app/globals.css).
        "accent-deep": "hsl(var(--accent-deep))",
        "surface-hover": "hsl(var(--surface-hover))",
        danger: "hsl(var(--danger))",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      // One radius scale for the whole system: controls -> buttons ->
      // compact cards -> large cards. Components pick a step, never a
      // bespoke value.
      borderRadius: {
        lg: "0.625rem",   // 10px  small controls
        xl: "0.9375rem",  // 15px  buttons
        "2xl": "1.125rem", // 18px compact cards
        "3xl": "1.625rem", // 26px large cards
      },
      maxWidth: {
        editorial: "68rem",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        grow: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        grow: "grow 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
