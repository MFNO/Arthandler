/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/*.tsx", "./src/components/**/*.tsx", "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"],

  theme: {
    fontFamily: { body: ['"Open Sans"'] },
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
