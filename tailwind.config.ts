import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(220 14% 90%)",
        input: "hsl(220 14% 90%)",
        ring: "hsl(224 71% 45%)",
        background: "hsl(220 33% 99%)",
        foreground: "hsl(222 47% 12%)",
        primary: {
          DEFAULT: "hsl(223 83% 50%)",
          foreground: "hsl(210 40% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(220 25% 94%)",
          foreground: "hsl(222 47% 15%)",
        },
        muted: {
          DEFAULT: "hsl(220 20% 95%)",
          foreground: "hsl(220 9% 46%)",
        },
        accent: {
          DEFAULT: "hsl(187 92% 41%)",
          foreground: "hsl(210 40% 98%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222 47% 12%)",
        },
      },
      borderRadius: {
        lg: "0.95rem",
        md: "0.7rem",
        sm: "0.45rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
