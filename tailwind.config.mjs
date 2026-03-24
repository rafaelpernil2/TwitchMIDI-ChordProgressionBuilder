/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0a0a12",
          card: "#12121e",
          elevated: "#1a1a2e",
        },
      },
    },
  },
  plugins: [],
};
