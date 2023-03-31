import Menu from "components/Menu/Menu";
// import RequireAuth from 'components/RequireAuth'

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Amplify } from "aws-amplify";

import DriversManagement from "pages/DriversManagement/DriversManagement";
import SignUp from "pages/SignUp/SignUp";
import LogIn from "pages/LogIn/LogIn";
import ActiveOrders from "pages/ActiveOrders/ActiveOrder";
import OrderHistory from "pages/OrderHistory/OrderHistory";
import Page from "components/Page";
import CreateManagerAccount from "pages/CreateManagerAccount/CreateManagerAccount";
import ManagementInfo from "pages/ManagementInfo/ManagementInfo";
import { useTestQuery } from "hooks/useTestQuery";

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
  useTestQuery();
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
            path="/activeOrder"
            element={
              <Page>
                <ActiveOrders />
              </Page>
            }
          />
          <Route
            path="/orderHistory"
            element={
              <Page>
                <OrderHistory />
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
