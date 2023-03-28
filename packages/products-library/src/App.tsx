import Menu from "components/Menu/Menu";
import Page from "components/Page";

import BulkUpdateTable from "pages/BulkUpdateTable/BulkUpdateTable";

import LogIn from "pages/LogIn/LogIn";

import Product from "pages/Manage/components/Product";
import UpdateProduct from "pages/Manage/components/UpdateProduct";
import ManageProducts from "pages/Manage/Manage";

import ResetPassword from "pages/ResetPassword/ResetPassword";
import PageNotFound from "components/PageNotFound";

import StoreInfo from "pages/StoreInfo/CompanyInfo";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";

import ManageBrands from "pages/Brands/ManageBrands";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import CreateCompany from "pages/CreateCompany/CreateCompany";

function App() {
  Amplify.configure(awsconfig);

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
              path="createcompany"
              element={
                <Page>
                  <CreateCompany />
                </Page>
              }
            />

            <Route
              path="brands"
              element={
                <Page>
                  <ManageBrands />
                </Page>
              }
            />

            <Route
              path={"/products/:productId"}
              element={
                <Page>
                  <UpdateProduct />
                </Page>
              }
            />
          </Route>

          <Route path="/resetPassword" element={<ResetPassword />} />

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
