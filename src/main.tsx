import { StrictMode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.tsx";
import { store } from "./store/store.ts";
import { AuthProvider } from "./contexts/Auth/AuthContext.tsx";

import "./index.css";
import "react-image-crop/dist/ReactCrop.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
