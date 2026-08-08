import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#081120",
        panel: "#0f1b2d",
        accent: "#5eead4",
        success: "#86efac",
        danger: "#fca5a5",
        muted: "#94a3b8"
      }
    }
  },
  plugins: []
};

export default config;
