import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { HashRouter } from "react-router-dom";

const savedTheme = localStorage.getItem("chichebe-theme");
document.documentElement.setAttribute(
  "data-theme",
  savedTheme === "dark" ? "dark" : "chichebe",
);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
