import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        flat: "0px 4px 0px 0px rgba(0, 0, 0, 0.4)",
      },
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    theme: {},
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
