/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern: /bg-(red|green|blue|yellow|purple|pink)-(100|200|300|400|500)/,
    },
    {
      pattern: /text-(red|green|blue|yellow|purple|pink)-(100|200|300|400|500)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Roboto fontu
        ptserif: ['PT Serif', 'serif'], 
        caveat: ['Caveat', 'cursive'], // Caveat fontu
      },
    },
  },
  plugins: [],
}

