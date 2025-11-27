/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cores Natalinas
        christmas: {
          red: "#c41e3a",
          "red-dark": "#8b0000",
          "red-light": "#ff6b6b",
          green: "#165b33",
          "green-dark": "#0a3d22",
          "green-light": "#228b22",
          gold: "#ffd700",
          "gold-dark": "#daa520",
          cream: "#fffef0",
          snow: "#fffafa",
          pine: "#01786f",
          holly: "#00563f",
          berry: "#bb2528",
          ribbon: "#ea4630",
        },
      },
      fontFamily: {
        christmas: ["Mountains of Christmas", "cursive"],
        festive: ["Caveat", "cursive"],
      },
      backgroundImage: {
        "snow-pattern":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='10' cy='10' r='2' fill='white' fill-opacity='0.3'/%3E%3Ccircle cx='50' cy='30' r='1.5' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='80' cy='20' r='2' fill='white' fill-opacity='0.3'/%3E%3Ccircle cx='30' cy='60' r='1' fill='white' fill-opacity='0.5'/%3E%3Ccircle cx='70' cy='70' r='2' fill='white' fill-opacity='0.3'/%3E%3Ccircle cx='20' cy='90' r='1.5' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='90' cy='50' r='1' fill='white' fill-opacity='0.5'/%3E%3Ccircle cx='60' cy='90' r='2' fill='white' fill-opacity='0.3'/%3E%3C/svg%3E\")",
        "christmas-gradient":
          "linear-gradient(135deg, #165b33 0%, #c41e3a 50%, #165b33 100%)",
      },
      animation: {
        "snow-fall": "snowfall 10s linear infinite",
        twinkle: "twinkle 2s ease-in-out infinite",
        "bounce-slow": "bounce 3s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
      },
      keyframes: {
        snowfall: {
          "0%": { transform: "translateY(-100vh) rotate(0deg)" },
          "100%": { transform: "translateY(100vh) rotate(360deg)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px #ffd700, 0 0 10px #ffd700" },
          "50%": { boxShadow: "0 0 20px #ffd700, 0 0 30px #ffd700" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
      },
      screens: {
        xs: "375px",
        "iphone-se": "375px",
        "iphone-xr": "414px",
        "iphone-12": "390px",
        "iphone-14": "393px",
        "iphone-14-plus": "428px",
        "iphone-15": "393px",
        "iphone-15-pro-max": "430px",
        redmi: "393px",
        samsung: "412px",
        pixel: "411px",
      },
    },
  },
  plugins: [],
};
