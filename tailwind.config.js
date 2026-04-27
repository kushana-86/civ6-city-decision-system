/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#111827',
        panelSoft: '#172033',
        gold: '#f6c453',
        cyanLine: '#22d3ee'
      },
      boxShadow: {
        glow: '0 0 32px rgba(34, 211, 238, 0.18)'
      }
    },
  },
  plugins: [],
};
