const flowbite = require("flowbite-react/tailwind");

// /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
    // "node_modules/flowbite-react/dist/esm/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
    // require("flowbite/plugin")
  ],
}

