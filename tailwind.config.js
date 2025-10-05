/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        "actor": ["Actor_400Regular"],
        "adlam": ["ADLaMDisplay_400Regular"]
      }
    },
  },
  plugins: [],
};