import React from "react";
import ReactDOM from "react-dom/client";
import "@/styles/main.scss";
import { RouterProvider } from "react-router-dom";
import router from "./App.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <RouterProvider router={router} />
      </GoogleOAuthProvider>
  </React.StrictMode>
);
