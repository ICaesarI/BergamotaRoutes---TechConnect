
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-main": "#111926",
        "blue-hover": "#77c3fa",
        "blue-bg": "#4264d0",
        "gray-main": "#878a9a",
        "green-bold": "#4e6260",
        "green-grass": "#55ad59",
        "yellow-alert": "#e59b2b",
        "yellow-alert-hover":"#f1ae37",
      },
    },
  },
  plugins: [],
};
export default config;


