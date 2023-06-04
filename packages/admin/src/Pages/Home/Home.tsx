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
  return (
    <Container>
      <Card>
        <VerifyDriverManagement />
      </Card>
    </Container>
  );
};

export default Home;
