import Menu from "components/Menu/Menu";
// import RequireAuth from 'components/RequireAuth'

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Amplify } from "aws-amplify";

import DriversManagement from "pages/DriversManagement/DriversManagement";
import SignUp from "pages/SignUp/SignUp";
import LogIn from "pages/LogIn/LogIn";
import ActiveOrders from "pages/ActiveOrders/ActiveOrder";

import Page from "components/Page";
import CreateManagerAccount from "pages/CreateManagerAccount/CreateManagerAccount";
import ManagementInfo from "pages/ManagementInfo/ManagementInfo";
import { useTestQuery } from "hooks/useTestQuery";
import Orders from "pages/Order/Orders";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import fetchUtil from "utils/fetch";
import { useEffect } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { useUser } from "contexts/userContext/User";
function App() {
  Amplify.configure({
    Auth: {
      mandatorySignIn: false,
      region: import.meta.env.VITE_APP_COGNITO_REGION,
      userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
      identityPoolId: import.meta.env.VITE_APP_COGNITO_IDENTITY_POOL_ID,
      userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
    },
    Storage: {
      region: import.meta.env.VITE_APP_COGNITO_REGION,
      bucket: import.meta.env.VITE_APP_BUCKET,
      identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
    },
  });
  const { loggedIn } = useUser();
  const [notificationTokenSent, setNotificationTokenSent] = useLocalStorage({
    key: "notificationTokenSent",
    defaultValue: false,
  });
  useEffect(() => {
    console.log("update");
    if (loggedIn && !notificationTokenSent) {
      if ("Notification" in window) {
        if (
          Notification.permission !== "granted" ||
          (Notification.permission === "granted" && !notificationTokenSent)
        ) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              // Permission has been granted, you can now display notifications
              // console.log("Notification permission granted.");
              // Call the messaging.getToken() method here to retrieve the registration token
              // and send push notifications to the device.
              const firebaseConfig = {
                apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env
                  .VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
              };

              // Initialize Firebase
              const app = initializeApp(firebaseConfig);

              const messaging = getMessaging(app);
              console.log("dbcjbdhcbdhcbdbhcbd");
              getToken(messaging, {
                vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
              })
                .then((currentToken) => {
                  if (currentToken) {
                    console.log("Device token:", currentToken);
                    // send the token to your server to associate it with the user
                    fetchUtil({
                      reqData: [{ notificationToken: currentToken }],
                      url: `${
                        import.meta.env.VITE_APP_BASE_URL
                      }/updateNotificationTokens`,
                    })
                      .then((res) => {
                        console.log(
                          "🚀 ~ file: App.tsx:117 ~ .then ~ res:",
                          res
                        );
                        if (res === "success") setNotificationTokenSent(true);
                      })
                      .catch((err) => {
                        setNotificationTokenSent(false);
                      });
                  } else {
                    console.log("No registration token available.");
                  }
                })
                .catch((error) => {
                  console.log(
                    "An error occurred while retrieving the device token.",
                    error
                  );
                  setNotificationTokenSent(false);
                });
            } else {
              // Permission has not been granted, you cannot display notifications
              setNotificationTokenSent(false);
            }
          });
        }
      }
    }
  }, [loggedIn, notificationTokenSent]);

  return (
    <BrowserRouter>
      <Menu>
        <Routes>
          <Route
            path="/"
            element={
              <Page>
                <DriversManagement />
              </Page>
            }
          />
          <Route
            path="/signup"
            element={
              <Page>
                <SignUp />
              </Page>
            }
          />
          <Route
            path="/login"
            element={
              <Page>
                <LogIn />
              </Page>
            }
          />
          <Route
            path="/orders"
            element={
              <Page>
                <Orders />
              </Page>
            }
          />

          <Route
            path="/createManagement"
            element={
              <Page>
                <CreateManagerAccount />
              </Page>
            }
          />
          <Route
            path="/management"
            element={
              <Page>
                <ManagementInfo />
              </Page>
            }
          />
        </Routes>
      </Menu>
    </BrowserRouter>
  );
}

export default App;
