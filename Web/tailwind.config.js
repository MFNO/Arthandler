/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.tsx",
    './src/components/**/*.tsx',],
  theme: {
    fontFamily: { 'body': ['"Open Sans"'], },
    extend: {},
  },
  plugins: [],
}

