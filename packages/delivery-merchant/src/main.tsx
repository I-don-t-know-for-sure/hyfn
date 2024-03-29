import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import reportWebVitals from "./reportWebVitals";

import UserProvider from "contexts/UserContextOld/Provider";
import Providers from "Providers";
import "./i18nextBase";
ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <UserProvider>
        <App />
      </UserProvider>
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
