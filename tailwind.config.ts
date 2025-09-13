import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'buk-bg': "#000000",
        '[#1a1c1c]': "#1a1c1c",
        '[#eaf740]': "#eaf740",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.25)"
      },
      borderRadius: { xl2: "1.25rem" }
    },
  },
  plugins: [],
} satisfies Config;
