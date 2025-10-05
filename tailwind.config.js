/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        "actor": ["Actor_400Regular"],
        "adlam": ["ADLaMDisplay_400Regular"],
        "archivo": ["Archivo_500Medium"],
        
        // inter fonts
        "inter": ["Inter_400Regular"],
        "interBold": ["Inter_700Bold"],
        "interBlack": ["Inter_900Black"],
        
        "poppins": ["Poppins_400Regular"],

        // roboto fonts
        "roboto": ["Roboto_400Regular"],
        "robotoMedium": ["Roboto_500Medium"],
        "robotoBold": ["Roboto_700Bold"],
        "robotoBlack": ["Roboto_900Black"]
      }
    },
  },
  plugins: [],
};