import ReactDOM from "react-dom/client";
import "@/styles/main.scss";
import App from "./App.tsx";
import React from "react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <App />
   </React.StrictMode>
);
