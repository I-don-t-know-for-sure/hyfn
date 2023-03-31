import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  PaperStylesParams,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import SearchProvider from "contexts/searchContext/SearchProvider";
import React, { useEffect, useState } from "react";
// import { Helmet, HelmetProvider } from 'react-helmet-async'

import { NotificationsProvider } from "@mantine/notifications";

import { QueryClient, QueryClientProvider } from "react-query";
import FixedComponentProvider from "contexts/fixedComponentContext/FixedComponentProvider";
import UserProvider from "contexts/userContext/User";

const Providers: React.FC = ({ children }) => {
  const queryClient = new QueryClient();

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  // useEffect(() => {
  //   if (colorScheme === "light") {
  //     document
  //       .querySelector("#my-manifest-placeholder")
  //       .setAttribute("href", `${import.meta.env.PUBLIC_URL}/manifest.json`);
  //     return;
  //   }
  //   document
  //     .querySelector("#my-manifest-placeholder")
  //     .setAttribute("href", `${import.meta.env.PUBLIC_URL}/darkManifest.json`);
  // }, [colorScheme]);

  return (
    // <HelmetProvider>
    <NotificationsProvider>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: colorScheme,
            breakpoints: {
              xs: 370,
              sm: 576,
              md: 870,
              lg: 990,
              xl: 1200,
            },
            components: {
              Paper: {
                styles: (theme, params: PaperStylesParams) => ({
                  root: {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.white,
                    padding: "8px",
                  },
                }),
              },
            },

            primaryColor: "green",
          }}
          // styles={{
          //   Button: (theme, ButtonParams) => ({
          //     default: {
          //       color: theme.primaryColor,
          //     },
          //   }),
          //   Box: (theme, cardParams) => ({}),
          //   Container: (theme, cardParams) => ({}),
          // }}
        >
          <SearchProvider>
            <QueryClientProvider client={queryClient}>
              <UserProvider>
                <FixedComponentProvider>{children}</FixedComponentProvider>
              </UserProvider>
            </QueryClientProvider>
          </SearchProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </NotificationsProvider>
    // </HelmetProvider>
  );
};

export default Providers;