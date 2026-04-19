import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'portfolio-cream': '#F5F4EF',
        'portfolio-red': '#CC1A1A',
        'portfolio-black': '#1A1A1A',
        'portfolio-gray': '#6B6B6B',
        'portfolio-border': '#E0DED8',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 10vw, 9rem)', { lineHeight: '0.9', letterSpacing: '-0.03em', fontWeight: '900' }],
        'section-title': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1', fontWeight: '900' }],
        'section-number': ['0.75rem', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '600' }],
      },
      spacing: {
        'section': '7rem',
        'section-sm': '4rem',
      },
      maxWidth: {
        'portfolio': '1280px',
      },
      borderRadius: {
        'portfolio': '2px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
