/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#172B4D',
          blue: '#3563E9',
          'blue-hover': '#2752D8',
          'blue-light': '#DCE6F8',
          slate: '#475569',
          muted: '#64748B',
          bg: '#F8FAFC',
          secondary: '#F1F5F9',
          border: '#E2E8F0',
        },
      },
    },
  },
  plugins: [],
}
