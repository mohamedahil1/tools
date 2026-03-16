import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem'
      },
      colors: {
        surface: {
          bg: '#0F172A',
          card: '#1E293B'
        },
        brand: {
          DEFAULT: '#6366F1'
        },
        ink: {
          DEFAULT: '#E2E8F0'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: []
};

export default config;

