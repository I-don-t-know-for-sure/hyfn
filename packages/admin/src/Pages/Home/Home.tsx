import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Paper,
  Text,
} from "@mantine/core";

import React, { useEffect, useState } from "react";
import VerifyDriverManagement from "./components/VerifyDriverManagement";

const Home: React.FC = () => {
  // const { data } = useGetStoreInfo()
  // console.log('🚀 ~ file: Home.tsx ~ line 18 ~ data', data)

  // TODO clean this page
  // any logic inside an if statement shoud be put in a function
  // instead of if else statments use guard clauses and return for more readablity
  // check for null and undefined after mongo queries and find function
  // after an update check if the operation actually updated a document
  // create yup schemas for mongo documents and validate everything before performing any operation even on parts of documents
  // use throw key word to throw custom errors
  // make sure that everything is predictable
  // put finctions in seperate files for better code read
  // after map and filter maybe check if the array is diffrent to make sure that the code is always working right

  return (
    <Container>
      <Card>
        <VerifyDriverManagement />
      </Card>
    </Container>
  );
};

export default Home;
