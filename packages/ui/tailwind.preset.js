const colors = require("tailwindcss/colors");

module.exports = {
  theme: {
    colors: {
      ...colors,
      primary: {
        darker: "hsl(153, 45%, 10%)",
        dark: "hsl(153, 45%, 15%)",
        DEFAULT: "hsl(153, 45%, 20%)",
        light: "hsl(153, 45%, 25%)",
        lighter: "hsl(153, 45%, 30%)",
      },
      // secondary: colors.yellow,
      // neutral: colors.gray,
    },
    // fontFamily: {
    //   sans: ['Graphik', 'sans-serif'],
    // }
  },
};
