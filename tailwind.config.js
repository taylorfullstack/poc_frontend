/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          DEFAULT: 'hsla(var(--brand-blue), <alpha-value>)',
        },
        'brand-orange': {
          DEFAULT: 'hsla(var(--brand-orange), <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}

