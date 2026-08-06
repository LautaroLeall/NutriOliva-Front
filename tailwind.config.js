/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── NutriOliva Design System ──────────────────────
        olive: {
          DEFAULT: '#6E7A4B',
          dark: '#3F4A2B',
          deep: '#5C6740',
        },
        cream: {
          DEFAULT: '#F6F1E7',
          dark: '#EDE6D2',
          darker: '#E3DBC8',
        },
        accent: {
          DEFAULT: '#D85A30',
          bg: '#FAECE7',
        },
        muted: '#8A8567',
        success: '#6E9B5C',
        warning: '#D8A93A',
        danger: '#C4573F',
        // ──────────────────────────────────────────────────
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        editorial: ['Lora', 'serif'],
      },
      borderRadius: {
        pill: '22px',
        card: '14px',
        phone: '38px',
      },
      boxShadow: {
        card: '0 8px 30px rgba(63, 74, 43, 0.12)',
        modal: '0 20px 60px rgba(0, 0, 0, 0.28)',
        phone: '0 12px 40px rgba(63, 74, 43, 0.18)',
      },
    },
  },
  plugins: [],
}
