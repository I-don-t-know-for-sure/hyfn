import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import SearchProvider from "contexts/searchContext/SearchProvider";
import React, { useEffect, useState } from "react";
// import { Helmet, HelmetProvider } from "react-helmet-async";

import { NotificationsProvider } from "@mantine/notifications";

import { QueryClient, QueryClientProvider } from "react-query";
import FixedComponentProvider from "contexts/fixedComponentContext/FixedComponentProvider";

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

            primaryColor: "green",
          }}
          styles={{
            Button: (theme, ButtonParams) => ({
              default: {
                color: theme.primaryColor,
              },
            }),
            Box: (theme, cardParams) => ({}),
            Container: (theme, cardParams) => ({}),
          }}
        >
          <SearchProvider>
            <QueryClientProvider client={queryClient}>
              <FixedComponentProvider>{children}</FixedComponentProvider>
            </QueryClientProvider>
          </SearchProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </NotificationsProvider>
    // </HelmetProvider>
  );
};

export default Providers;
