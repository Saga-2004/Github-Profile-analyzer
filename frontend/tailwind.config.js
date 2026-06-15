/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        github: {
          dark: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          blue: '#58a6ff',
          green: '#3fb950',
          textPrimary: '#e6edf3',
          textSecondary: '#8b949e',
        }
      }
    },
  },
  plugins: [],
}
