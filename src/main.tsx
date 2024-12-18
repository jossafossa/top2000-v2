import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store";
import "./assets/main.scss";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { QueryParamProvider } from "use-query-params";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryParamProvider>
    </BrowserRouter>
  </StrictMode>
);
