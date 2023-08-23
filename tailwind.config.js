/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      question: ["Tinos"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["autumn"],
  },
};
