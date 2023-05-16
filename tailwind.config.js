/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Roboto', 'Arial', 'sans-serif'],
      serif: ['Georgia', 'Times New Roman', 'serif'],
      mono: ['Fira Code', 'Courier New', 'monospace'],
    },
    colors: {
      "light": "#e6e3d9",
      "light-darker": "#d1cfc6",
      "lighter": "#f5f5f5",
      "light-accent": "#c2a6a0",
      "light-accent-hover": "#b08f8a",
      "brand": "#e35c79",
      "dark-accent": "#af3f2d",
      "dark-accent-hover": "#9a3628",
      "dark": "#292d53",
      "dark-lighter": "#3c4066",
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
