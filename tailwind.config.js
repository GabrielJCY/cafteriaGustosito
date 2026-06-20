/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        cafe: {
          50: '#FBF8F4',
          100: '#F5EFE8',
          200: '#E8DDD5',
          300: '#D4C4B8',
          400: '#B8A294',
          500: '#8D6E63',
          600: '#6F4E37',
          700: '#5D4037',
          800: '#4E342E',
          900: '#3E2723',
          950: '#1A0F0A',
        },
        crema: '#FBF8F4',
        negro: '#1A0F0A',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};