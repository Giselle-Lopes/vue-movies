/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"]
      },
      gridTemplateColumns: {
        "70/30": "70% 28%"
      },
      colors: {
        'primaryDarkPurple': '#40011E',
        'primaryPink': '#D904A0',
        'primaryYellow': '#F2B33D',
        'primaryDarkYellow': '#F29727',
        'primaryOrange': '#F26B1D',
      },
    },
  },
  plugins: [],
}

