import Menu from "components/Menu/Menu";
// import RequireAuth from 'components/RequireAuth'
import WithoutAuth from "components/WithoutAuth";
import BulkUpdateTable from "pages/BulkUpdateTable/BulkUpdateTable";
import CreateCollection from "pages/Collections/components/CreateCollection";
import UpdateCollection from "pages/Collections/components/UpdateCollection";
import ManageCollections from "pages/Collections/ManageCollections";

import LogIn from "pages/LogIn/LogIn";

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
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
// import { Helmet } from "react-helmet-async";
import { useLocalStorage } from "@mantine/hooks";
import { useUserCheck } from "hooks/useUserCheck";
import CreateStore from "pages/CreateStore/CreateStore";

import { Amplify } from "aws-amplify";

import Page from "components/Page";
import { log } from "console";

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
  console.log("process env", import.meta.env);
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
