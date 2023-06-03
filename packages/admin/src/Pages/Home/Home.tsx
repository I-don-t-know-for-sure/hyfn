import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Paper,
  Text,
} from "hyfn-client";

import React, { useEffect, useState } from "react";
import VerifyDriverManagement from "./components/VerifyDriverManagement";

const Home: React.FC = () => {
  return (
    <Container>
      <Card>
        <VerifyDriverManagement />
      </Card>
    </Container>
  );
};

export default Home;
