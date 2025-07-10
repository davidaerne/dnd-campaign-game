/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dnd-red': '#8B0000',
        'dnd-blue': '#1E3A8A',
        'dnd-green': '#166534',
        'dnd-purple': '#581C87',
        'dnd-gold': '#FFD700',
      },
      fontFamily: {
        'fantasy': ['Cinzel', 'serif'],
        'body': ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 