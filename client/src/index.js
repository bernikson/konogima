import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Routes from "./Routes";
import Store from "./redux/Store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={Store}>
      <Routes />
      <Toaster position="bottom-center" />
    </Provider>
  </BrowserRouter>
);
