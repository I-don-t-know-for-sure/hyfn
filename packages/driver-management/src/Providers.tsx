import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  PaperStylesParams,
} from "hyfn-client";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";

// import { Helmet, HelmetProvider } from "react-helmet-async";

import { QueryClient, QueryClientProvider } from "react-query";

import { UserProvider } from "hyfn-client";
import { ReactProps } from "config/types";
import { useGetUserDocument } from "hooks/useGetUserDocument";
import { Auth } from "aws-amplify";

const Providers: React.FC<ReactProps> = ({ children }) => {
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
            xs: "370",
            sm: "576",
            md: "870",
            lg: "990",
            xl: "1200",
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
        <QueryClientProvider client={queryClient}>
          <UserProvider
            useGetUserDocument={useGetUserDocument}
            queryClient={queryClient}
            Auth={Auth}
          >
            {children as any}
          </UserProvider>
        </QueryClientProvider>
      </MantineProvider>
    </ColorSchemeProvider>
    // </HelmetProvider>
  );
};

export default Providers;
