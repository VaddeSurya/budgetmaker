/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      animation: {
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'shake': 'shake 0.3s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'particle-1': 'particle1 8s linear infinite',
        'particle-2': 'particle2 10s linear infinite',
        'particle-3': 'particle3 6s linear infinite',
        'particle-4': 'particle4 7s linear infinite', // New white dot
        'particle-5': 'particle5 9s linear infinite', // New white dot
        'particle-6': 'particle6 5s linear infinite', // New white dot
        'pulse-slow': 'pulse 5s ease-in-out infinite',
        'slide-in': 'slideIn 1s ease-in-out',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        particle1: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(200px, -150px)', opacity: '0' },
        },
        particle2: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(-250px, 100px)', opacity: '0' },
        },
        particle3: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(150px, 200px)', opacity: '0' },
        },
        particle4: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(-180px, -120px)', opacity: '0' },
        },
        particle5: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(100px, 250px)', opacity: '0' },
        },
        particle6: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(300px, 80px)', opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      textShadow: {
        'glow': '0 0 10px rgba(59, 130, 246, 0.8)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.hover\\:glow-text': {
          '&:hover': {
            textShadow: '0 0 10px rgba(59, 130, 246, 0.8)',
          },
        },
      };
      addUtilities(newUtilities, ['hover']);
    },
  ],
};