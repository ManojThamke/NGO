/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B6E4F',
        accent: '#F59E0B',
        neutral900: '#0F172A',
        bg: '#F8FAFC'
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif']
      },
    },
  },
  plugins: [],
};
