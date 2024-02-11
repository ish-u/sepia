/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
            "background-size": "5000% 5000%",
            "background-position": "10% 0%",
            transform: "rotate(0deg)",
          },
          "50%": {
            "background-size": "5000% 5000%",
            "background-position": "100% 100%",
            transform: "rotate(180deg)",
          },
          "100%": {
            "background-size": "5000% 5000%",
            "background-position": "10% 0%",
            transform: "rotate(360deg)",
          },
        },
        pulse: {
          "0%": {
            transform: "scale(0.5)",
          },
          "50%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(0.5)",
          },
        },
      },
      animation: {
        appear: "appear 150ms",
        gradient: "gradient 100s ease infinite",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
