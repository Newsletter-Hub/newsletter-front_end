/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontFamily: {
      body: ['Alegreya'],
    },
    extend: {
      boxShadow: {
        md: '0px 4px 60px rgba(0,0,0,0.1)',
      },
      spacing: {
        '10px': '10px',
        29: '116px',
        32: '126px',
        21: '85px',
      },
    },
    fontSize: {
      base: ['16px', '22px'],
      sm: ['14px', '20px'],
      '2xl': ['24px', '32px'],
      '7xl': ['72px', '98px'],
    },
    colors: {
      primary: '#01AAED',
      black: '#000000',
      'light-grey': '#FAF9F7',
      'dark-grey': '#404040',
      grey: '#5A616D',
      'gull-grey': '#A3A9AC',
      yellow: '#F7B500',
      white: '#FFFFFF',
      facebookBlue: '#3B5998',
      twitterBlue: '#4099FF',
      googleBlack: '#25282B',
      mercury: '#E1E1E1',
      'input-grey': 'rgba(112, 119, 133, 0.1)',
    },
  },
  plugins: [],
};
