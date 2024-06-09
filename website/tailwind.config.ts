import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#FFFBEA",
        "brand-gray": "9A9A9A",
        wording: "#0A0A09",
      },
    },
  },
} satisfies Config;
