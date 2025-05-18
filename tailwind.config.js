/** @type {import('tailwindcss').Config} */
module.exports = {
  resolver: {
    sourceExts: ['web.js', 'native.js', 'js', 'jsx', 'ts', 'tsx']
  },
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#00b14f',
        secondary: '#000000',
        thirdly: 'FFFFFF',
        greenLight: '#98FB98',
        pinkLight: 'FFE4B5',
        orangeLight: '#FFFACD',
        yellowLight: '#FFCC00'
      }
    }
  },
  plugins: []
}
