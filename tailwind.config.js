/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FF1493',
        'neon-blue': '#00D4FF',
        'neon-purple': '#8B5CF6',
        'neon-green': '#39FF14',
        'neon-yellow': '#FFD700',
        'neon-orange': '#FF4500',
        'dark-bg': '#0A0A0F',
        'dark-surface': '#12121A',
        'dark-card': '#1A1A24',
      },
      animation: {
        'float-up': 'float-up 2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-scale': 'bounce-scale 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        'float-up': {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.8)' },
          '50%': { opacity: 1, transform: 'translateY(-30px) scale(1.1)' },
          '100%': { opacity: 0, transform: 'translateY(-60px) scale(0.9)' }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'bounce-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      }
    },
  },
  plugins: [],
}