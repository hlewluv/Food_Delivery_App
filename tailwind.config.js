/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#00b14f',
        secondary: '#000000',
        thirdly: '#FFFFFF',
        greenLight: '#98FB98',
        pinkLight: '#FFE4B5',
        orangeLight: '#FFFACD',
        yellowLight: '#FFCC00',
        customGreen: '#50dd90', // Added for bg-[#50dd90] in ConnectionModal
      },
    },
  },
  plugins: [],
};