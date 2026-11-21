import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { navy: "#071426", panel: "#0d1d33", electric: "#328cff" }, boxShadow: { glow: "0 0 45px rgba(50,140,255,.18)" } } },
  plugins: []
};
export default config;
