import { Button, Card } from "@mantine/core";
import React from "react";

interface CardProps {}

const CardTest: React.FC<CardProps> = ({}) => {
  return (
    <Card>
      <Button>click</Button>
    </Card>
  );
};

export default CardTest;
