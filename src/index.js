import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Tailwind-enhanced styles
import AOS from "aos";
import "aos/dist/aos.css";
import { AnimatePresence } from "framer-motion";

// Initialize AOS on load
AOS.init({
  once: true,
  delay: 50,
  duration: 800,
  easing: "ease-in-out",
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AnimatePresence mode="wait">
      <App />
    </AnimatePresence>
  </React.StrictMode>
);
