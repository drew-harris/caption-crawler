import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#FFFBEA",
        "brand-gray": "9A9A9A",
        wording: "#0A0A09",
        "strong-blue": "#1F40ED",
        navy: "#274591",
        tan: {
          "200": "#E2DCC6",
        },
      },
    },
  },
} satisfies Config;
