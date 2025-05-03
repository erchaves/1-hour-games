/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arcade': {
          'purple': '#7F3FBF',
          'pink': '#FF6B9D',
          'blue': '#00C2FF',
          'green': '#00FF9D',
          'yellow': '#FFD600',
          'orange': '#FF6B00',
        }
      },
      fontFamily: {
        'arcade': ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'pixel-fade': 'pixelFade 0.3s steps(4)',
        'blink': 'blink 1s step-start infinite',
      },
      keyframes: {
        pixelFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}