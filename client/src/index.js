import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Routes from "./Routes";
import Store from "./redux/Store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Helmet>
      <title>Konogima | უყურე ანიმეებს</title>
      <meta name="description" content="უახლესი ანიმეები კარგი გახმოვანებით" />
    </Helmet>
    <Provider store={Store}>
      <Routes />
      <Toaster position="bottom-center" />
    </Provider>
  </BrowserRouter>
);
