/* eslint-env node */

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        domine: ["Domine", "serif"],
        vollkorn: ["Vollkorn", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#6A67CE",
          darker: "#4A46C3",
        },
        canvas: "#313642",
        "card-background": {
          DEFAULT: "#3D4352",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
