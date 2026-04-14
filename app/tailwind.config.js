/**
 * Tailwind CSS Configuration — Tributos Brasil Ltda
 * ====================================================
 * Brand Palette:
 *   navy      : #003366  (primary institutional blue)
 *   deep-navy : #001a33  (backgrounds, footer)
 *   green     : #00A86B  (accent / CTA)
 *   gold      : #C9A84C  (premium accent, badges)
 *   gray-corp : #f4f6f9  (section backgrounds)
 *
 * Typography:
 *   Headlines : Montserrat (700/800)
 *   Body      : Open Sans (400/600)
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ─── Brand color tokens ───────────────────────────────────────────────
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand-specific tokens (use as bg-navy, text-navy, etc.)
        navy: {
          DEFAULT: '#003366',
          light: '#004d99',
          dark: '#001a33',
        },
        'brand-green': {
          DEFAULT: '#00A86B',
          light: '#00c97f',
          dark: '#007a4e',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#e0bf6a',
          dark: '#a07830',
        },
        'gray-corp': '#f4f6f9',
      },

      // ─── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },

      // ─── Box shadows ──────────────────────────────────────────────────────
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'navy-sm': '0 4px 14px rgba(0, 51, 102, 0.15)',
        'navy-md': '0 8px 30px rgba(0, 51, 102, 0.2)',
        'navy-lg': '0 20px 60px rgba(0, 51, 102, 0.25)',
        'green-sm': '0 4px 14px rgba(0, 168, 107, 0.25)',
        'green-md': '0 8px 30px rgba(0, 168, 107, 0.3)',
        'green-lg': '0 20px 60px rgba(0, 168, 107, 0.35)',
        'card': '0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.08), 0 20px 60px rgba(0,51,102,0.12)',
      },

      // ─── Font families ────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
      },

      // ─── Custom animations ────────────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "line-grow": {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "slide-up": "slide-up 0.5s var(--ease-expo-out) forwards",
        "fade-in": "fade-in 0.4s ease forwards",
        "scale-in": "scale-in 0.4s var(--ease-expo-out) forwards",
        "line-grow": "line-grow 0.6s var(--ease-expo-out) forwards",
      },

      // ─── Spacing extras ───────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
