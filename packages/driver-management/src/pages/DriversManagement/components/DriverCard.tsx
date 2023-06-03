import { Card, Group, Text } from "hyfn-client";
import React from "react";
import AddDriverModal from "./AddDriverModal";

interface DriverCardProps {
  driverInfo: any;
  addDriver: any;
}

const DriverCard: React.FC<DriverCardProps> = ({ driverInfo, addDriver }) => {
  return (
    <Card
      shadow={"md"}
      sx={{
        maxWidth: "500px",
        margin: "0px auto",
      }}
    >
      <Group position="apart">
        <Text>{driverInfo?.lastName}</Text>
        <AddDriverModal driver={driverInfo} addDriver={addDriver} />
      </Group>
    </Card>
  );
};

export default DriverCard;
