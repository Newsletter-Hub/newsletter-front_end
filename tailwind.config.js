/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontFamily: {
      inter: ['Inter', 'Alegreya', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      height: {
        82: '341px',
      },
      backgroundImage: {
        getStarted: "url('../assets/images/getStartedBackground.png')",
      },
      boxShadow: {
        md: '0px 4px 60px rgba(0,0,0,0.1)',
        lg: '0px 3px 14px rgba(74, 58, 255, 0.03), 0px -2px 4px rgba(20, 20, 43, 0.02), 0px 12px 24px rgba(20, 20, 43, 0.04);',
        xl: '0px 7px 24px rgba(20, 20, 43, 0.05)',
      },
      spacing: {
        '10px': '10px',
        29: '116px',
        32: '126px',
        21: '85px',
      },
    },
    fontSize: {
      xs: ['13px', '18px'],
      base: ['16px', '22px'],
      sm: ['14px', '24px'],
      lg: ['18px', '25px'],
      xl: ['22px', '30px'],
      xs: ['12px', '24px'],
      '2xl': ['24px', '32px'],
      '4xl': ['36px', '42px'],
      '5xl': ['48px', '68px'],
      '7xl': ['72px', '98px'],
      '2xs': ['11px', '15px'],
      '3xl': ['32px', '38px'],
    },
    colors: {
      primary: '#01AAED',
      'primary-light': '#E6F7FD',
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
      waterloo: '#6F6C90',
      'dark-blue': '#170F49',
      'shark-blue': '#1F2027',
      'light-blue': '#e6f8fd',
      red: '#FF0000',
      'cornflower-blue': '#253646',
    },
  },
  plugins: [],
};
