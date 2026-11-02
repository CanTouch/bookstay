/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#FF385C', dark: '#E00B41', deep: '#D70466' },
        ink: { DEFAULT: '#222222', soft: '#6A6A6A', line: '#DDDDDD', bg: '#F7F7F7' },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        pill: '0 3px 12px 0 rgba(0,0,0,0.10)',
        card: '0 6px 20px rgba(0,0,0,0.12)',
        float: '0 8px 28px rgba(0,0,0,0.28)',
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)',
      },
    },
  },
  plugins: [],
}
