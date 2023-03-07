/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        lumbr: {
          primary: "#4AB694",
          secondary: "#eab308",
          accent: "#BBBAAF",
          neutral: "#989584",
          "base-100": "#E3E2DC",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
      "dark",
    ],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
