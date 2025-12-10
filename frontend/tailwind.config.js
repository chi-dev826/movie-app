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
      aspectRatio: {
        poster: '2 / 3',
        cinema: '21 / 9',
      },
      zIndex: {
        backdrop: 10,
        gradient: 20,
        overlay: 30,
        modal: 40,
        toast: 50,
      },
    },
  },
  plugins: [],
};
