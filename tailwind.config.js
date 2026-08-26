/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'naranja-energy': '#F97316',
        'aqua-turquesa': '#00E5FF',
        'negro-profundo': '#04040A',
        'midnight-panel': '#0A0A14',
        'deep-grid': '#0F0F1E',
        'blanco-puro': '#F0F0F8',
        'humo': '#E0E0E0',
        'dorado': '#FFD700',
      },
      boxShadow: {
        'glowEnergy': '0 0 12px rgba(249, 115, 22, 0.35)',
        'glowEnergyHover': '0 0 20px rgba(249, 115, 22, 0.55)',
        'turquesaSoft': '0 0 10px rgba(0, 229, 255, 0.20)',
        'turquesaHover': '0 0 14px rgba(0, 229, 255, 0.45)',
        'blancoPulse': '0 0 10px rgba(255, 255, 255, 0.80)',
        'card': '0 8px 24px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'soft': '10px',
        'medium': '12px',
        'large': '14px',
      }
    },
  },
  plugins: [],
}
