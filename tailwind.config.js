/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', 
    theme: {
      extend: {
        colors: {
          'sidebar-light': '#f9fafb',
          'sidebar-dark': '#1a202c',
        },
      },
    },
    plugins: [],
  }