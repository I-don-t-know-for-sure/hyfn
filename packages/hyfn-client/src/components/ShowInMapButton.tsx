import { Button } from "@mantine/core";
import React from "react";

interface ShowInMapButtonProps {
  label: string;
  component: any;
  coords: string;
}

const ShowInMapButton: React.FC<ShowInMapButtonProps> = ({
  label,
  component,
  coords,
}) => {
  return (
    <Button
      target="_blank"
      rel="noopener noreferrer"
      to={`https://www.google.com/maps/search/?api=1&query=${coords}`}
      component={component}
    >
      {label}
    </Button>
  );
};

export default ShowInMapButton;
