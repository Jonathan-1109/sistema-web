/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
          deep: 'rgb(var(--paper-deep) / <alpha-value>)',
          elevated: 'rgb(var(--paper-elevated) / <alpha-value>)',
          muted: 'rgb(var(--paper-muted) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
        coral: {
          DEFAULT: 'rgb(var(--coral) / <alpha-value>)',
          glow: 'rgb(var(--coral-glow) / <alpha-value>)',
          dim: 'rgb(var(--coral-dim) / <alpha-value>)',
        },
        rose: {
          DEFAULT: 'rgb(var(--rose) / <alpha-value>)',
          glow: 'rgb(var(--rose-glow) / <alpha-value>)',
          dim: 'rgb(var(--rose-dim) / <alpha-value>)',
        },
        sage: {
          DEFAULT: 'rgb(var(--sage) / <alpha-value>)',
          glow: 'rgb(var(--sage-glow) / <alpha-value>)',
          dim: 'rgb(var(--sage-dim) / <alpha-value>)',
        },
        violet: {
          DEFAULT: 'rgb(var(--violet) / <alpha-value>)',
          soft: 'rgb(var(--violet-soft) / <alpha-value>)',
        },
      },
      fontSize: {
        'ui-sm': ['0.8125rem', { lineHeight: '1.4' }],
        'ui-base': ['0.9375rem', { lineHeight: '1.5' }],
        'ui-lg': ['1.0625rem', { lineHeight: '1.55' }],
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        lift: 'var(--shadow-lift)',
        panel: 'var(--shadow-panel)',
        inset: 'var(--shadow-inset)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
