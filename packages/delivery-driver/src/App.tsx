import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import Page from "./components/Page";
import SignUp from "./Pages/SignUp/SignUp";

import Home from "./Pages/Home/Home";
import LogIn from "Pages/Login/LogIn";

import Account from "Pages/Account/Account";
import ActiveOrder from "Pages/ActiveOrder/ActiveOrder";

import ResetPassword from "Pages/ResetPassword/ResetPassword";
import OrderHistory from "Pages/OrderHistory/OrderHistory";
import CreateAccount from "Pages/CreateAccount/CreateAccount";

import { Amplify, Auth } from "aws-amplify";

import Proposals from "Pages/Proposals/Proposals";
import Map from "Pages/Home/HomeWithMap";

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
    // VITE_APP_MAP_NAME: mapName,
    //   VITE_APP_MAP_REGION: mapRegion,
    //   VITE_APP_MAP_STYLE: mapStyle,
    // geo: {
    //   AmazonLocationService: {
    //     maps: {
    //       items: {
    //         [import.meta.env.VITE_APP_MAP_NAME]: {
    //           // REQUIRED - Amazon Location Service Map resource name
    //           style: import.meta.env.VITE_APP_MAP_STYLE, // REQUIRED - String representing the style of map resource
    //         },
    //       },
    //       default: import.meta.env.VITE_APP_MAP_NAME, // REQUIRED - Amazon Location Service Map resource name to set as default
    //     },

    //     region: import.meta.env.VITE_APP_MAP_REGION, // REQUIRED - Amazon Location Service Region
    //   },
    // },
  });
  console.log("🚀 ~ file: App.tsx:100 ~ App ~ VITE_APP_COGNITO_REGION:", {
    region: import.meta.env.VITE_APP_COGNITO_REGION,
    userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
    identityPoolId: import.meta.env.VITE_APP_COGNITO_IDENTITY_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
  });
  console.log(
    "🚀 ~ file: App.tsx:100 ~ App ~ VITE_APP_COGNITO_IDENTITY_POOL_ID:",
    import.meta.env.VITE_APP_COGNITO_IDENTITY_POOL_ID
  );
  console.log("update");

  return (
    <BrowserRouter>
      <Menu>
        <Routes>
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
              path="/map"
              element={
                <Page>
                  <Map />
                </Page>
              }
            />
            <Route
              path="signup"
              element={
                <Page>
                  <SignUp />
                </Page>
              }
            />
            <Route
              path="login/:firstlogin"
              element={
                <Page>
                  <LogIn />
                </Page>
              }
            />
            <Route
              path="login"
              element={
                <Page>
                  <LogIn />
                </Page>
              }
            />
            <Route
              path="account"
              element={
                <Page>
                  <Account />
                </Page>
              }
            />
            <Route
              path="createaccount"
              element={
                <Page>
                  <CreateAccount />
                </Page>
              }
            />

            <Route
              path="/activeorder"
              element={
                <Page>
                  <ActiveOrder />
                </Page>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <Page>
                  <OrderHistory />
                </Page>
              }
            />
            <Route
              path="/proposals"
              element={
                <Page>
                  <Proposals />
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
          </Route>
        </Routes>
      </Menu>
    </BrowserRouter>
  );
}

export default App;
