module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      keyframes: {
        scan: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(150px)" },
        },
        "bike-run": {
          "0%": { left: "100%" },
          "100%": { left: "-4rem" },
        },
      },
      animation: {
        scan: "scan 1.5s ease-in-out infinite",
        "bike-run": "bike-run 2s linear infinite",
      },
    },
  },
};
