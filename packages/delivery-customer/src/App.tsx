import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { useEffect } from "react";

import "./App.css";
import Menu from "./components/Menu/Menu";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import StoreFront from "./pages/StoreFront/StoreFront";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import CheckOut from "./pages/CheckOut/CheckOut";
import Explore from "./pages/Explore/Explore";
import LogIn from "./pages/Login/LogIn";
import SignUp from "./pages/Signup/SignUp";

import ProductWithoutOptions from "./pages/Product/ProductWithoutOptions";

import Orders from "./pages/Orders/Orders";

import AccountSettings from "./pages/AccountSettings/AccountSettings";
import ActiveOrders from "./pages/Orders/components/ActiveOrders";
import Collection from "./pages/Collection/Collection";
import OrderHistory from "./pages/Orders/components/OrderHistory";
import Page from "./components/Page";

import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ManageAddresses from "./pages/Addresses/Addresses";
import CreateCustomer from "./pages/CreateCustomer/CreateCustomer";
import { Amplify } from "aws-amplify";
import LandingPage from "pages/LandingPage/LandingPage";

import { useUser } from "contexts/userContext/User";
import { useLocalStorage } from "@mantine/hooks";
import fetchUtil from "util/fetch";

function App() {
  Amplify.configure({
    Auth: {
      mandatorySignIn: false,
      region: import.meta.env.VITE_APP_COGNITO_REGION,
      userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
      identityPoolId: import.meta.env.VITE_APP_COGNITO_IDENTITY_POOL_ID,
      userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
    },
    // oauth: {

    // },
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
          <Route path={"/"}>
            <Route index element={<LandingPage />} />
            <Route
              path="/home"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
            <Route
              path=":storefront/:country/:city"
              element={
                <Page>
                  <StoreFront />
                </Page>
              }
            />
            <Route
              path="product/:storefront/:country/:city/:productId"
              element={
                <Page>
                  <Product />
                </Page>
              }
            />
            <Route
              path="product/withnotoptions/:storefront/:country/:city/:productId"
              element={
                <Page>
                  <ProductWithoutOptions />
                </Page>
              }
            />

            <Route path="login" element={<LogIn />} />
            <Route path="signup" element={<SignUp />} />

            <Route
              path="explore"
              element={
                <Page>
                  <Explore />
                </Page>
              }
            />
            <Route
              path="cart"
              element={
                <Page>
                  <Cart />
                </Page>
              }
            />
            <Route
              path="checkout"
              element={
                <Page>
                  <CheckOut />
                </Page>
              }
            />

            <Route
              path="resetPassword"
              element={
                <Page>
                  <ResetPassword />
                </Page>
              }
            />
            <Route
              path="accountsettings"
              element={
                <Page>
                  <AccountSettings />
                </Page>
              }
            />

            <Route
              path="createcustomer"
              element={
                <Page>
                  <CreateCustomer />
                </Page>
              }
            />
            <Route
              path="collection/:storefront/:collectionid/:country"
              element={
                <Page>
                  <Collection />
                </Page>
              }
            />
          </Route>
          <Route
            path="/addresses"
            element={
              <Page>
                <ManageAddresses />
              </Page>
            }
          />
          <Route path="/orders">
            <Route
              index
              element={
                <Page>
                  <Orders />
                </Page>
              }
            />
            <Route
              path="/orders/activeorders"
              element={
                <Page>
                  <ActiveOrders />
                </Page>
              }
            />
            <Route
              path="/orders/orderhistory"
              element={
                <Page>
                  <OrderHistory />
                </Page>
              }
            />
          </Route>
        </Routes>
      </Menu>
    </BrowserRouter>
  );
}

export default App;
