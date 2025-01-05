/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  
  theme: {
    
    extend: {
      fontFamily: {
      'ivy': ['sofia-pro', 'sans-serif']
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(50px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 1.5s ease-out',
    },
  },
  
  plugins: [],
}
}
