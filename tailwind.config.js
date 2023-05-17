/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './tailwind.safelist.txt',
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      black: '#000000',
      white: '#FFFFFF',
      gray: '#BBBBBB',
      ultramarine: '#3904E9',
      status: {
        nodata: '#8F8F8F',
        proposed: '#FD9154',
        paused: '#E91E63',
        working: '#F4C51F',
        done: '#48DBDB',
      },
    },
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
  },
  plugins: [],
};
