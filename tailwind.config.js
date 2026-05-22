/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        profit: {
          win: '#16a34a',
          lose: '#dc2626',
          draw: '#6b7280',
        },
      },
    },
  },
  plugins: [],
}
