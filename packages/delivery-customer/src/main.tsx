import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import reportWebVitals from "./reportWebVitals";

//import UserProvider from "contexts/UserContext/Provider";

import Providers from "./Providers";
import "./i18nextBase";
ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// messaging.onBackgroundMessage((payload) => {
//   console.log('Message received in background:', payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon,
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
