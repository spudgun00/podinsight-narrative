import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-ink': '#1a1a2e',
        'warm-paper': '#fafaf9',
        'sage': '#4a7c59',
        'sage-dark': '#3d6548',
        'dusty-rose': '#c77d7d',
        'amber-glow': '#f4a261',
        'slate-blue': '#5a6c8c',
        'light-sage': '#e8f0ea',
        'light-rose': '#f5e6e6',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'panel': '-4px 0 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;