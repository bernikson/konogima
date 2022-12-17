import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Routes from "./Routes";
import Store from "./redux/Store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={Store}>
      <HelmetProvider>
        <Routes />
        <Toaster position="bottom-center" />
      </HelmetProvider>
    </Provider>
  </BrowserRouter>
);
