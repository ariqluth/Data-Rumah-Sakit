import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";

import App from "./App.jsx";
import "./index.css";
import { store } from "./app/store.js";
import { auth0Config } from "./config/auth0.js";

const container = document.getElementById("root");

createRoot(container).render(
  <StrictMode>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Config.audience,
      }}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </Auth0Provider>
  </StrictMode>
);
