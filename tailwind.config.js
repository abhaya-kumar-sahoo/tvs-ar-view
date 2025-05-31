module.exports = {
  theme: {
    extend: {
      keyframes: {
        scan: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(150px)" },
        },
      },
      animation: {
        scan: "scan 1.5s ease-in-out infinite",
      },
    },
  },
};
