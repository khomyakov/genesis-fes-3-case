/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './src/components/ui/**/*.{ts,tsx}', // shadcn components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};