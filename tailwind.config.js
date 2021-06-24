module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx,svg}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Halyard Display", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        primary: "#ff4a4a",
        secondary: "#ffe41e",
        gray: {
          DEFAULT: "#828282",
          dark: "#3B3B3B",
          darker: "#313131",
          darkest: "#191919",
          badge: "#272528",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
