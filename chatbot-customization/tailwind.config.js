/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chat-red': '#EF4444',
        'chat-pink': '#EC4899',
        'chat-purple': '#A855F7',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(236, 72, 153, 0.5)',
      },
    },
  },
  plugins: [],
}
