import Menu from "components/Menu/Menu";
// import RequireAuth from 'components/RequireAuth'
import WithoutAuth from "components/WithoutAuth";
import BulkUpdateTable from "pages/BulkUpdateTable/BulkUpdateTable";
import CreateCollection from "pages/Collections/components/CreateCollection";
import UpdateCollection from "pages/Collections/components/UpdateCollection";
import ManageCollections from "pages/Collections/ManageCollections";

import { SignUp } from "hyfn-client";
// import { LogIn } from "hyfn-client";

import Product from "pages/Manage/components/Product";
import UpdateProduct from "./pages/Manage/components/UpdateProduct";
import ManageProducts from "pages/Manage/Manage";
import OptionsTable from "pages/OptionsTable/OptionsTable";
import ActiveOrders from "pages/Orders/Components/ActiveOrders";
import OrderHistory from "pages/Orders/Components/OrderHistory";
import OrderHisto from "pages/Orders/Components/OrderHistory";
import Orders from "pages/Orders/Orders";
import Payments from "pages/Payments/Payment";
import ResetPassword from "pages/ResetPassword/ResetPassword";
import PageNotFound from "components/PageNotFound";

import StoreInfo from "pages/StoreInfo/StoreInfo";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
// import { Helmet } from "react-helmet-async";
import { useLocalStorage } from "@mantine/hooks";
import { useUserCheck } from "hooks/useUserCheck";
import CreateStore from "pages/CreateStore/CreateStore";

import { Amplify } from "aws-amplify";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import fetchUtil from "utils/fetch";
import Page from "components/Page";
import { log } from "console";
import { useUser } from "contexts/userContext/User";
import LogIn from "pages/LogIn/LogIn";

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
          {/* <Route path="*" element={<PageNotFound />} /> */}

          <Route path="/">
            <Route
              index
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
            <Route
              path="products"
              element={
                <Page>
                  <ManageProducts />
                </Page>
              }
            />
            <Route
              path="collections"
              element={
                <Page>
                  <ManageCollections />
                </Page>
              }
            />

            <Route
              path="optionstable"
              element={
                <Page>
                  <OptionsTable />
                </Page>
              }
            />

            <Route
              path="createcollection"
              element={
                <Page>
                  <CreateCollection requestType="create" />
                </Page>
              }
            />

            <Route
              path="orderhistory"
              element={
                <Page>
                  <OrderHistory />
                </Page>
              }
            />

            <Route
              path="activeorders"
              element={
                <Page>
                  <ActiveOrders />
                </Page>
              }
            />
            <Route
              path="bulkupdate"
              element={
                <Page>
                  <BulkUpdateTable />
                </Page>
              }
            />
            <Route
              path="product"
              element={
                <Page>
                  <Product />
                </Page>
              }
            />
            <Route
              path="storeinfo"
              element={
                <Page>
                  <StoreInfo />
                </Page>
              }
            />
            <Route
              path="createstore"
              element={
                <Page>
                  <CreateStore />
                </Page>
              }
            />

            <Route
              path={"products/:productId"}
              element={
                <Page>
                  <UpdateProduct />
                </Page>
              }
            />

            <Route
              path={"/collection/:collectionId"}
              element={
                <Page>
                  <UpdateCollection />
                </Page>
              }
            />
            <Route
              path={"/payments"}
              element={
                <Page>
                  <Payments />
                </Page>
              }
            />
          </Route>

          <Route
            path="/resetPassword"
            element={
              // <WithoutAuth>
              <ResetPassword />
              // {/* </WithoutAuth> */}
            }
          />

          <Route path="/login/:firstlogin" element={<LogIn />} />
          <Route path="/login" element={<LogIn />} />

          <Route
            path="/signup"
            element={
              // <WithoutAuth>
              <SignUp />
              // </WithoutAuth>
            }
          />

          {/* // <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </Menu>
    </BrowserRouter>
  );
}

export default App;
