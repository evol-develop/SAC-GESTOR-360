import { StrictMode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.tsx";
import { store } from "./store/store.ts";
import { AuthProvider } from "./contexts/Auth/AuthContext.tsx";
import { NotificationProvider } from "./contexts/Notifications/index.tsx";

import "./index.css";
import "./styles/rich-text-editor.css";
import "react-image-crop/dist/ReactCrop.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <NotificationProvider>
            <HelmetProvider>
              <App />
            </HelmetProvider>
          </NotificationProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
