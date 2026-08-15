/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{tsx,ts,html}",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: "#fafafa",
          card: "#ffffff",
          subtle: "#f4f4f5"
        },
        zinc: {
          950: "#09090b",
          900: "#18181b",
          800: "#27272a",
          700: "#3f3f46",
          500: "#71717a",
          400: "#a1a1aa",
          300: "#d4d4d8",
          200: "#e4e4e7",
          100: "#f4f4f5",
          50: "#fafafa"
        }
      },
      borderRadius: {
        'subtle': '6px',
        'card': '8px',
        'panel': '12px'
      }
    },
  },
  plugins: [],
}
