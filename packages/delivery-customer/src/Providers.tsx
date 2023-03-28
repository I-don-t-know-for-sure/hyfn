import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import CartProvider from "./contexts/cartContext/Provider";
import CustomerDataProvider from "./contexts/customerData/CustomerDataProvider";
import FixedComponentProvider from "./contexts/fixedComponentContext/FixedComponentProvider";
import ImageProvider from "./contexts/imageContext/ImageProvider";
import LocationProvider from "./contexts/locationContext/LocationContext";
import SearchProvider from "./contexts/searchContext/SearchProvider";
import UserProvider from "./contexts/userContext/User";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  DatesProvider,
  MonthPickerInput,
  DatePickerInput,
} from "@mantine/dates";
import "dayjs/locale/ar-ly";
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
    <NotificationsProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <FixedComponentProvider>
            <CartProvider>
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
                  withNormalizeCSS
                >
                  <ImageProvider>
                    <LocationProvider>
                      <SearchProvider>
                        <CustomerDataProvider>
                          <DatesProvider
                            settings={{
                              locale: "ar-ly",
                              firstDayOfWeek: 0,
                              weekendDays: [0],
                            }}
                          >
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
    </NotificationsProvider>
  );
};

export default Providers;
