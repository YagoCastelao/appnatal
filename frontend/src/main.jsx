import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Fix para altura do viewport em mobile (problema com teclado virtual)
const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

// Atualizar na inicialização e redimensionamento
setVH();
window.addEventListener("resize", setVH);
window.addEventListener("orientationchange", () => {
  setTimeout(setVH, 100);
});

// Prevenir zoom com gestos de pinça em iOS
document.addEventListener("gesturestart", (e) => {
  e.preventDefault();
});

// Prevenir pull-to-refresh em mobile
document.body.addEventListener(
  "touchmove",
  (e) => {
    if (e.target.closest(".no-bounce")) {
      // Permite scroll dentro de elementos com classe no-bounce
      return;
    }
  },
  { passive: false }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
