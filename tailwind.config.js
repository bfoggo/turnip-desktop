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
      "dark": "#e9e7eb",
      "white": "#ffffff",
      "light": "#16718e",
      "primary": "#49266f",
      "secondary": "#ea0d47",
      "info": "#1c0aff",
      "success": "#00975b",
      "warning": "#dbc900",
      "danger": "#e72600",
      "more-danger": "#ff0000",
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
