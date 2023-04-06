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
import { test3 } from "hyfn-types";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ManageAddresses from "./pages/Addresses/Addresses";
import CreateCustomer from "./pages/CreateCustomer/CreateCustomer";
import { Amplify } from "aws-amplify";
import LandingPage from "pages/LandingPage/LandingPage";

function App() {
  console.log("🚀 ~ file: App.tsx:100 ~ App ~ VITE_APP_COGNITO_REGION:", {
    region: import.meta.env.VITE_APP_COGNITO_REGION,
    userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
    identityPoolId: import.meta.env.VITE_APP_COGNITO_IDENTITY_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
  });
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
  console.log(
    "🚀 ~ file: App.tsx:100 ~ App ~ VITE_APP_COGNITO_IDENTITY_POOL_ID:",
    import.meta.env.VITE_APP_COGNITO_IDENTITY_POOL_ID
  );
  console.log("update");

  useEffect(() => {}, []);

  console.log("🚀 ~ file: App.tsx:26 ~ test3:", test3);
  console.log("🚀 ~ file: App.tsx:26 ~ test3:", test3);
  return (
    <BrowserRouter>
      <Menu>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path={"/stores"}>
            <Route
              index
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
