/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0F0F0F',
          surface: '#1A1A1A',
          border: '#2A2A2A',
        },
        brand: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        text: {
          primary: '#FAFAFA',
          secondary: '#A1A1AA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        input: '6px',
      },
    },
  },
  plugins: [],
};
