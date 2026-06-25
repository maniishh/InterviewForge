export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        base: '#0A0A0F',
        surface: '#111118',
        elevated: '#1A1A24',
        border: '#1E1E2E',
        accent: {
          DEFAULT: '#6C63FF',
          hover: '#7B73FF',
          glow: 'rgba(108, 99, 255, 0.15)',
          subtle: 'rgba(108, 99, 255, 0.08)',
        },
        success: {
          DEFAULT: '#00D9A3',
          subtle: 'rgba(0, 217, 163, 0.1)',
        },
        warning: {
          DEFAULT: '#FFB547',
          subtle: 'rgba(255, 181, 71, 0.1)',
        },
        danger: {
          DEFAULT: '#FF5757',
          subtle: 'rgba(255, 87, 87, 0.1)',
        },
        text: {
          primary: '#F0EFF8',
          muted: '#6B6A7D',
          subtle: '#3D3C52',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'score-fill': 'scoreFill 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(108, 99, 255, 0.6)' },
        },
        scoreFill: {
          from: { strokeDashoffset: '283' },
          to: { strokeDashoffset: 'var(--dash-offset)' },
        },
      },

      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
        'card-lg': '0 4px 24px rgba(0,0,0,0.5)',
        accent: '0 0 30px rgba(108, 99, 255, 0.25)',
        success: '0 0 20px rgba(0, 217, 163, 0.2)',
        glow: '0 0 60px rgba(108, 99, 255, 0.15)',
        inner: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },

      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },

  plugins: [],
};