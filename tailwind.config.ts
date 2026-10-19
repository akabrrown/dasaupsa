import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class", "class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'DASA-orange': {
          DEFAULT: '#FF6B35',
          50: '#FFF0EA',
          100: '#FFE1D5',
          200: '#FFC3AB',
          300: '#FFA581',
          400: '#FF8757',
          500: '#FF6B35',
          600: '#E66030',
          700: '#CC562A',
          800: '#994020',
          900: '#662B15',
        },
        'DASA-black': {
          DEFAULT: '#000000',
          50: '#F2F2F2',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
        },
        'white': '#FFFFFF',
        'light-orange': '#FFF0EA', // Synced with DASA-orange-50
        'border-gray': '#e5e7eb',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config



