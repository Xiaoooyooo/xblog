/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * do not use .\/**\/*.tsx
   * use more specific paths
   * @see https://tailwindcss.com/docs/content-configuration#styles-rebuild-in-an-infinite-loop
   * path is relative to `process.cwd()`
   */
  content: [
    "app/components/**/*.tsx",
    "app/layouts/**/*.tsx",
    "app/views/**/*.tsx",
    "app/public/index.html",
  ],
  theme: {
    extend: {},
    screens: {
      sm: "640px",
      md: "1024px",
      lg: "1280px",
    },
  },
  plugins: [],
};
