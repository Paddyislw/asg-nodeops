import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'bg': "#000000",
        'card': "#1a1c1c",
        'primary': "#eaf740",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.25)"
      },
      borderRadius: { xl2: "1.25rem" }
    },
  },
  plugins: [],
} satisfies Config;
