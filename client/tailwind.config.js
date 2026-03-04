/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        periwinkle: {
          DEFAULT: '#D0DDFF',
          light: '#E8EEFF',
          dark: '#A8B8E8',
        },
        cream: {
          DEFAULT: '#F5DEC9',
          light: '#FBF0E5',
          dark: '#E8C9AB',
        },
        walnut: {
          DEFAULT: '#3D1900',
          light: '#5C3A1E',
          medium: '#6B4226',
        },
        offwhite: '#FEFCFA',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease both',
        'fade-in': 'fadeIn 0.5s ease both',
        'shimmer': 'shimmer 1.5s ease infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
