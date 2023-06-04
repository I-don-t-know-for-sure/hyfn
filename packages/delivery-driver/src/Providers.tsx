import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import LocationProvider from "contexts/locationContext/LocationContext";
import { UserProvider } from "hyfn-client";
import { DatesProvider } from "@mantine/dates";
import "dayjs/locale/ar-ly";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetUserDocument } from "hooks/useGetUserDocument";
import { Auth } from "aws-amplify";
import { Notifications } from "@mantine/notifications";

const Providers: React.FC = ({ children }) => {
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
        <Notifications />
        <LocationProvider>
          <QueryClientProvider client={queryClient}>
            <UserProvider
              useGetUserDocument={useGetUserDocument}
              queryClient={queryClient}
              Auth={Auth}
            >
              <DatesProvider
                settings={{
                  locale: "ar-ly",
                  firstDayOfWeek: 0,
                  weekendDays: [0],
                }}
              >
                {children}
              </DatesProvider>
            </UserProvider>
          </QueryClientProvider>
        </LocationProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default Providers;
