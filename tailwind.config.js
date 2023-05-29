/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '425px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },
    fontFamily: {
      alegreya: ['Alegreya', 'ui-sans-serif', 'system-ui'],
      inter: ['Inter', 'Alegreya', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      height: {
        82: '341px',
      },
      backgroundImage: {
        getStarted: "url('../assets/images/getStartedBackground.png')",
        profile: "url('../assets/images/userPageBg.jpg')",
      },
      boxShadow: {
        md: '0px 4px 60px rgba(0,0,0,0.1)',
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
      lg: ['18px', '32px'],
      xl: ['22px', '32px'],
      xs: ['12px', '24px'],
      '2xl': ['24px', '32px'],
      '4xl': ['36px', '42px'],
      '5xl': ['40px', '48px'],
      '7xl': ['72px', '98px'],
      '2xs': ['11px', '15px'],
      '3xl': ['32px', '38px'],
    },
    colors: {
      primary: '#01AAED',
      'primary-light': '#E6F7FD',
      black: '#000000',
      lightBlack: '#25282B',
      white: '#FFFFFF',
      grey: '#A8AFB5',
      'light-grey': '#D3D7DA',
      'dark-grey': '#515E6B',
      'grey-chat': '#A0A4A8',
      porcelain: '#E9EBEC',
      'light-porcelain': '#F4F5F6',
      red: '#FF0000',
      yellow: '#F7B500',
      blue: '#23459F',
      'dark-blue': '#253646',
    },
  },
  plugins: [],
};
