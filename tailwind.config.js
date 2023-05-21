/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')


module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Roboto', 'Helvetica', 'Futura', 'Gill Sans', 'Verdana', 'Trebuchet MS', 'Arial', 'sans-serif'],
      serif: ['Georgia', 'Palatino Linotype', 'Baskerville', 'Garamond', 'Hoefler Text', 'Book Antiqua', 'Cambria', 'Times New Roman', 'serif'],
      mono: ['Fira Code', 'Monaco', 'Consolas', 'Lucida Console', 'Source Code Pro', 'Inconsolata', 'Courier New', 'monospace'],
    },
    colors: {
      "transparent": "transparent",
      "current": "currentColor",
      "white": colors.white,
      "black": colors.black,
      "red": colors.red,
      "green": colors.green,
      "gray": colors.zinc,
      'turquoise': {
        '50': '#effef9',
        '100': '#c9fef1',
        '200': '#94fbe3',
        '300': '#56f2d2',
        '400': '#27debf',
        '500': '#0bc1a5',
        '600': '#059c87',
        '700': '#097c6e',
        '800': '#0d6259',
        '900': '#10514a',
        '950': '#02312e',
      },
      'royal-blue': {
        '50': '#f0f6fe',
        '100': '#ddeafc',
        '200': '#c3dcfa',
        '300': '#9ac6f6',
        '400': '#6aa8f0',
        '500': '#4787ea',
        '600': '#3b71e0',
        '700': '#2956cc',
        '800': '#2747a6',
        '900': '#253e83',
        '950': '#1b2850',
      },

    },
    plugins: [],
  }
}
