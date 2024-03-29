import { ColorScheme, MantineProvider, PaperStylesParams } from "@mantine/core";
import { ColorSchemeProvider } from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import SearchProvider from "contexts/searchContext/SearchProvider";
import React, { useEffect, useState } from "react";
// import { Helmet, HelmetProvider } from 'react-helmet-async'

import { QueryClient, QueryClientProvider } from "react-query";
import FixedComponentProvider from "contexts/fixedComponentContext/FixedComponentProvider";
import { MantineContext, UserProvider } from "hyfn-client";

import { useGetUserDocument } from "hooks/useGetUserDocument";
import { Auth } from "aws-amplify";
import { Notifications } from "@mantine/notifications";

const Providers: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme
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

    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: colorScheme,
          breakpoints: {
            xs: "370px",
            sm: "576px",
            md: "870px",
            lg: "990px",
            xl: "1200px"
          },
          components: {
            Paper: {
              styles: (theme, params: PaperStylesParams) => ({
                root: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.white,
                  padding: "8px"
                }
              })
            }
          },

          primaryColor: "green"
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
        <Notifications />
        <SearchProvider>
          <QueryClientProvider client={queryClient}>
            <UserProvider
              useGetUserDocument={useGetUserDocument}
              queryClient={queryClient}
              Auth={Auth}>
              <FixedComponentProvider>{children}</FixedComponentProvider>
            </UserProvider>
          </QueryClientProvider>
        </SearchProvider>
      </MantineProvider>
    </ColorSchemeProvider>

    // </HelmetProvider>
  );
};

export default Providers;
