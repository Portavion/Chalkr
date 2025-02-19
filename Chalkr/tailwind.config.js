/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app.{js,jsx,ts,tsx}", "./app/**/*.tsx", "./components/**/*.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
