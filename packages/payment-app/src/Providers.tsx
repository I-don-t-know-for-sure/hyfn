import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineColorScheme,
} from "hyfn-client";
import { useLocalStorage } from "@mantine/hooks";

import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          breakpoints: {
            xs: "370",
            sm: "576",
            md: "870",
            lg: "980",
            xl: "1200",
          },

          primaryColor: "green",
          components: {
            Button: {
              styles: (theme) => ({
                white: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[7]
                      : theme.white,
                  color:
                    theme.colorScheme === "light" ? theme.black : theme.white,
                },
              }),
            },
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default Providers;
