/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ryp: {
          green:       '#00AF51',
          'green-dark':'#008f42',
          'green-deep':'#003d1c',
          'green-tint':'#e6f9ef',
          black:       '#0D0D0D',
          'off-white': '#f5f5f2',
          mid:         '#888888',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
