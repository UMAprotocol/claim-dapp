module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Halyard Display", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        primary: "#ff4a4a",
        secondary: "#ffe41e",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

// background: #FFE41E;
// background: #FFFFFF;
// background: #FFFFFF 15%;
// background: #4D4D4D;
// background: #000000;
// background: #000000 30%;
// background: #191919;
// background: #FF4A4A;
// background: #FFFFFF 10%;
