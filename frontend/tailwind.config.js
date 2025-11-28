/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 使用class模式切换暗夜主题
  theme: {
    extend: {
      colors: {
        // 主色调 - 科技感蓝色系
        primary: {
          50: '#e6f3ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0066cc', // 主色
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          900: '#001429',
        },
        // 辅助色 - 青色系
        secondary: {
          50: '#e6fffb',
          100: '#b3fff5',
          200: '#80ffeb',
          300: '#4dffe1',
          400: '#1affd7',
          500: '#00e6cc', // 辅助色
          600: '#00b3a3',
          700: '#00807a',
          800: '#004d52',
          900: '#001a29',
        },
        // 成功色
        success: {
          50: '#e6f7e6',
          100: '#b3efb3',
          200: '#80e780',
          300: '#4ddf4d',
          400: '#1ad71a',
          500: '#00cc00',
          600: '#00a300',
          700: '#007a00',
          800: '#005200',
          900: '#002900',
        },
        // 警告色
        warning: {
          50: '#fffbe6',
          100: '#fff5b3',
          200: '#ffeb80',
          300: '#ffe14d',
          400: '#ffd71a',
          500: '#ffcc00',
          600: '#cca300',
          700: '#997a00',
          800: '#665200',
          900: '#332900',
        },
        // 危险色
        danger: {
          50: '#ffe6e6',
          100: '#ffb3b3',
          200: '#ff8080',
          300: '#ff4d4d',
          400: '#ff1a1a',
          500: '#e60000',
          600: '#b30000',
          700: '#800000',
          800: '#520000',
          900: '#290000',
        },
        // 背景色
        background: {
          light: '#ffffff',
          dark: '#0f0f23',
          secondary: {
            light: '#f8fafc',
            dark: '#1a1a2e',
          },
          tertiary: {
            light: '#f1f5f9',
            dark: '#16213e',
          },
        },
        // 表面色
        surface: {
          light: '#ffffff',
          dark: '#1a1a2e',
          secondary: {
            light: '#f8fafc',
            dark: '#16213e',
          },
        },
        // 文字色
        text: {
          primary: {
            light: '#1e293b',
            dark: '#f1f5f9',
          },
          secondary: {
            light: '#64748b',
            dark: '#94a3b8',
          },
          tertiary: {
            light: '#94a3b8',
            dark: '#64748b',
          },
        },
        // 边框色
        border: {
          light: '#e2e8f0',
          dark: '#334155',
          secondary: {
            light: '#f1f5f9',
            dark: '#1e293b',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px rgba(0, 0, 0, 0.12)',
        'hard': '0 8px 40px rgba(0, 0, 0, 0.16)',
        'glow': '0 0 20px rgba(0, 102, 204, 0.3)',
        'glow-secondary': '0 0 20px rgba(0, 230, 204, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
