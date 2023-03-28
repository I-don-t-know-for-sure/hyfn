import React from "react";

import "./App.css";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";

import Pay from "./components/Pay";

function App() {
  // usePayWithLocalCard();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
