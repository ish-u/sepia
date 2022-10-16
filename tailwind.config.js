/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        appear: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        gradient: {
          "0% ": {
            "background-size": "300% 300%",
            "background-position": "10% 0%",
          },
          "50%": {
            "background-size": "300% 300%",
            "background-position": "91% 100%",
          },
          "100%": {
            "background-size": "300% 300%",
            "background-position": "10% 0%",
          },
        },
      },
      animation: {
        appear: "appear 150ms",
        gradient: "gradient 10s ease infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
