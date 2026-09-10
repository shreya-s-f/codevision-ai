/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          surface2: 'var(--surface2)',
          border: 'var(--border)',
        },
        ink: {
          hi: 'var(--ink-hi)',
          mid: 'var(--ink-mid)',
          low: 'var(--ink-low)',
        },
        // Premium Light Blue + Light Purple palette
        cv: {
          blue: '#38bdf8',       // Light Blue
          bluelight: '#7dd3fc',  // Sky light blue
          bluedark: '#0284c7',   // Deep sapphire
          purple: '#c084fc',     // Light Purple
          purplelight: '#e9d5ff',// Pastel lavender
          purpledark: '#7e22ce', // Deep violet
          indigo: '#818cf8',     // Soft periwinkle bridge
        },
        blue: {
          DEFAULT: '#38bdf8',
          dim: '#0284c7',
          glow: '#7dd3fc',
        },
        violet: {
          DEFAULT: '#c084fc',
          dim: '#7e22ce',
          glow: '#e9d5ff',
        },
        signal: {
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
        },
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        sans: ['"Urbanist"', 'sans-serif'],
        body: ['"Urbanist"', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(180deg, rgba(56,189,248,0.06) 0%, transparent 60%)',
        'aurora': 'radial-gradient(60% 50% at 20% 0%, rgba(56,189,248,0.18) 0%, transparent 60%), radial-gradient(50% 40% at 85% 15%, rgba(192,132,252,0.18) 0%, transparent 60%)',
        'gradient-cv': 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
        'gradient-cv-subtle': 'linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(192,132,252,0.12) 100%)',
        'scan-beam': 'linear-gradient(180deg, transparent 0%, rgba(56,189,248,0.8) 45%, rgba(192,132,252,0.9) 55%, transparent 100%)',
      },
      boxShadow: {
        glow: '0 0 35px rgba(56,189,248,0.25)',
        'glow-purple': '0 0 35px rgba(192,132,252,0.25)',
        'glow-subtle': '0 0 25px rgba(56,189,248,0.12)',
        card: '0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 40px -20px rgba(0,0,0,0.5)',
        'card-light': '0 4px 20px -2px rgba(56,189,248,0.06), 0 2px 6px -1px rgba(0,0,0,0.04)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-10%)' },
          '100%': { transform: 'translateY(110%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        scan: 'scan 3.2s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        fadeUp: 'fadeUp 0.6s ease forwards',
      },
    },
  },
  plugins: [],
}
