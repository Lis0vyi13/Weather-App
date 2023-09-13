/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      screens: {
        "mq-xs": "400px",
        "mq-min": "1px",
      },
    },
  },
  plugins: [],
};
