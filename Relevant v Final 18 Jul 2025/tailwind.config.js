/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Refined color palette with better contrast and hierarchy
        'midnight': '#0F1419',
        'slate-purple': '#1A1D29',
        'deep-slate': '#141824',
        'violet-pulse': '#7C3AED',
        'violet-light': '#8B5CF6',
        'teal-glow': '#06D6A0',
        'emerald-green': '#10B981',
        'amber-alert': '#F59E0B',
        'coral-red': '#EF4444',
        'light-ice': '#F8FAFC',
        'cloud-gray': '#94A3B8',
        'soft-navy': '#334155'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(124, 58, 237, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'bounce-soft': 'bounceSoft 1s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
};