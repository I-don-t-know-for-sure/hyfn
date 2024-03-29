import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import CartProvider from "./contexts/cartContext/Provider";
import CustomerDataProvider from "./contexts/customerData/CustomerDataProvider";
import FixedComponentProvider from "./contexts/fixedComponentContext/FixedComponentProvider";
import ImageProvider from "./contexts/imageContext/ImageProvider";
import LocationProvider from "./contexts/locationContext/LocationContext";
import SearchProvider from "./contexts/searchContext/SearchProvider";
import { UserProvider } from "hyfn-client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  DatesProvider,
  MonthPickerInput,
  DatePickerInput
} from "@mantine/dates";
import "dayjs/locale/ar-ly";
import { useGetUserDocument } from "hooks/useGetUserDocument";
import { Auth } from "aws-amplify";
const Providers: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider
        Auth={Auth}
        useGetUserDocument={useGetUserDocument}
        queryClient={queryClient}>
        <FixedComponentProvider>
          <CartProvider>
            <ColorSchemeProvider
              colorScheme={colorScheme}
              toggleColorScheme={toggleColorScheme}>
              <MantineProvider
                theme={{
                  colorScheme,
                  breakpoints: {
                    xs: "370",
                    sm: "576",
                    md: "870",
                    lg: "980",
                    xl: "1200"
                  },

                  primaryColor: "green"
                }}
                // styles={{
                //   Button: (theme, ButtonParams) => ({
                //     white: {
                //       backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                //       color: theme.colorScheme === 'light' ? theme.black : theme.white,
                //     },
                //   }),
                // }}
                withGlobalStyles
                withNormalizeCSS>
                <Notifications />
                <ImageProvider>
                  <LocationProvider>
                    <SearchProvider>
                      <CustomerDataProvider>
                        <DatesProvider
                          settings={{
                            locale: "ar-ly",
                            firstDayOfWeek: 0,
                            weekendDays: [0]
                          }}>
                          {children}
                        </DatesProvider>
                      </CustomerDataProvider>
                    </SearchProvider>
                  </LocationProvider>
                </ImageProvider>
              </MantineProvider>
            </ColorSchemeProvider>
          </CartProvider>
        </FixedComponentProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default Providers;
