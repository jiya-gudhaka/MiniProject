/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blueZodiac: "#122C4F",
        citrineWhite: "#FBF9E3",
        goldenDream: "#F0D637",
        hippieBlue: "#5B88B2",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(18,44,79,0.06), 0 2px 4px rgba(18,44,79,0.06)",
      },
      borderRadius: {
        xl: "0.75rem",
        '2xl': "1rem",
      },
    },
  },
  plugins: [],
}
