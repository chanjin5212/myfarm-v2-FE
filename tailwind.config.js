/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 감자색 팔레트
        potato: {
          50: '#fef9f3',
          100: '#fef2e2',
          200: '#fde1c8',
          300: '#fbc8a3',
          400: '#f7a76c',
          500: '#f38744',
          600: '#e46f2a',
          700: '#bc561f',
          800: '#964620',
          900: '#7a3b1d',
        },
        // 농업 관련 보조 색상들
        leaf: {
          green: '#22c55e',
        },
        earth: {
          brown: '#8b4513',
        },
        sunny: {
          yellow: '#facc15',
        },
        sky: {
          blue: '#38bdf8',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Arial', 'Helvetica', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-down': 'slideInDown 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { transform: 'translateY(10px)', opacity: '0.8' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
} 