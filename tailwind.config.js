/* eslint-env node */

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        itim: ["Itim", "cursive"],
        "noto-serif": ["Noto Serif", "serif"],
      },
    },
  },
  plugins: [],
};
