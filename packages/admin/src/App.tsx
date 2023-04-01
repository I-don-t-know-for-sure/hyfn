import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Amplify } from "aws-amplify";

import Menu from "./Components/Menu/Menu";
import RequireAuth from "./Components/RequireAuth";
import Home from "./Pages/Home/Home";
import LogIn from "./Pages/LogIn/LogIn";
import SignUp from "./Pages/SignUp/SignUp";
import DriverVerification from "./Pages/DriverVerification/DriverVerification";
import Reports from "./Pages/Reports/Reports";
import CreateAdmin from "./Pages/CreateAdmin/CreateAdmin";
import PaymentRequests from "./Pages/PaymentRequests/PaymentRequests";

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
  console.log("update");

  return (
    <BrowserRouter>
      <Menu>
        <Routes>
          {/* <Route path="*" element={<PageNotFound />} /> */}

          <Route path="/">
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="verifyDrivers"
              element={
                <RequireAuth>
                  <DriverVerification />
                </RequireAuth>
              }
            />
            <Route
              path="paymentRequests"
              element={
                <RequireAuth>
                  <PaymentRequests />
                </RequireAuth>
              }
            />
            <Route
              path="reports"
              element={
                <RequireAuth>
                  <Reports />
                </RequireAuth>
              }
            />
            <Route
              path="createAdmin"
              element={
                <RequireAuth>
                  <CreateAdmin />
                </RequireAuth>
              }
            />
          </Route>
          {/* <Route
            path="/resetPassword"
            element={
              // <WithoutAuth>
                // <ResetPassword />
              // </WithoutAuth>
            }
          /> */}

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
