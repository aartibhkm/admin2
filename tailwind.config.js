/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-light) / <alpha-value>)',
          600: 'rgb(var(--color-primary) / <alpha-value>)',
          700: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          800: 'rgb(var(--color-primary) / <alpha-value>)',
          900: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        secondary: {
          500: 'rgb(var(--color-secondary-light) / <alpha-value>)',
          600: 'rgb(var(--color-secondary) / <alpha-value>)',
          700: 'rgb(var(--color-secondary-dark) / <alpha-value>)',
        },
        accent: {
          500: 'rgb(var(--color-accent-light) / <alpha-value>)',
          600: 'rgb(var(--color-accent) / <alpha-value>)',
          700: 'rgb(var(--color-accent-dark) / <alpha-value>)',
        },
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        gray: {
          50: 'rgb(var(--color-gray-50) / <alpha-value>)',
          100: 'rgb(var(--color-gray-100) / <alpha-value>)',
          200: 'rgb(var(--color-gray-200) / <alpha-value>)',
          300: 'rgb(var(--color-gray-300) / <alpha-value>)',
          400: 'rgb(var(--color-gray-400) / <alpha-value>)',
          500: 'rgb(var(--color-gray-500) / <alpha-value>)',
          600: 'rgb(var(--color-gray-600) / <alpha-value>)',
          700: 'rgb(var(--color-gray-700) / <alpha-value>)',
          800: 'rgb(var(--color-gray-800) / <alpha-value>)',
          900: 'rgb(var(--color-gray-900) / <alpha-value>)',
          950: 'rgb(var(--color-gray-950) / <alpha-value>)',
        },
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-in-out',
        'slideDown': 'slideDown 0.3s ease-in-out',
        'scaleIn': 'scaleIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};