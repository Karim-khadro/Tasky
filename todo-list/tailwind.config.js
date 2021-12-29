const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
      gray: colors.slate,
      red: colors.red,
      blue: colors.blue,
      menu: '#2D3E4E',
      acceptbutton: '#56FD87',
      hoveracceptbutton: '#82FF50',
      deletebutton: '#F98388',
      hoverdeletebutton: '#F94242'
    },
    extend: {
      gridTemplateColumns: {
        'custom-sidenav-layout': 'auto 1fr',
      }
    },
  },
  plugins: [],
}