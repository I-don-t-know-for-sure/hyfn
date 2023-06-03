import { MantineProvider, MantineProviderProps } from "@mantine/core";
import React from "react";

const MantineContext: React.FC<MantineProviderProps> = ({
  children,
  ...props
}) => {
  return <MantineProvider {...props}>{children}</MantineProvider>;
};

export default MantineContext;
