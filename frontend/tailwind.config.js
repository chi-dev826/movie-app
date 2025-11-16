/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
  },
  plugins: [],
};
