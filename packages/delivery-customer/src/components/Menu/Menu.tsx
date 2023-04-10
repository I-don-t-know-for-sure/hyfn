import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Card,
  Container,
  createStyles,
  Drawer,
  Group,
  Menu as AvatarMenu,
  Popover,
  Select,
  Space,
  Text,
  TextInput,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
  LoadingOverlay,
  Loader,
  Stack,
  Image,
  Flex,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import {
  Link,
  Location,
  useLocation as useRouteLocation,
} from "react-router-dom";

import { MdLanguage, MdShoppingCart } from "react-icons/md";

import {
  getCountryInfo,
  lngs,
  MENU_HEIGHT,
  useConfigurationData,
} from "./config";
import { useCart } from "../../contexts/cartContext/Provider";
import { BsMoonStars, BsSun } from "react-icons/bs";
import BottomNav from "./components/BottomNav";

import {
  useLocation,
  useUpdateLocation,
} from "../../contexts/locationContext/LocationContext";
import {
  AiOutlineArrowDown,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { useFixedComponent } from "../../contexts/fixedComponentContext/FixedComponentProvider";
import { t } from "../../util/i18nextFix";
import { useTranslation } from "react-i18next";
import { useUserCheck } from "../../hooks/useUserCheck";
import { useGetUserDocument } from "../../hooks/useGetUserDocument";
import TransactionList from "../TransactionList";
import { useUser } from "../../contexts/userContext/User";
import { useRefreshBalance } from "../../hooks/useRefreshBalance";

const StyledNav: React.FC = ({ children, ...rest }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    styledNav: {
      position: "fixed",
      top: 0,
      left: 0,
      transition: "top 0.2s",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",

      width: "100%",
      height: `${MENU_HEIGHT}px`,

      borderBottom: "solid 2px rgba(133, 133, 133, 0.1)",
      zIndex: 60,
      transform: "translate3d(0, 0, 0)",
    },
  }));

  const { classes } = useStyles();
  return (
    <Box component="nav" className={classes.styledNav} {...rest}>
      {children as any}
    </Box>
  );
};

const Wrapper: React.FC = ({ children }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    wrapper: {
      position: "relative",
      width: "100%",
    },
  }));
  const { classes } = useStyles();
  return <Box className={classes.wrapper}>{children as any}</Box>;
};

const BodyWrapper: React.FC = ({ children }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    bodyWrapper: {
      position: "relative",
      display: "flex",
    },
  }));
  const { classes } = useStyles();
  return <Box className={classes.bodyWrapper}>{children as any}</Box>;
};

const Inner: React.FC<{
  showMenu: boolean;
  isMobile: boolean;
  location: Location;
}> = ({ children, showMenu, isMobile, location }) => {
  const useStyles = createStyles(
    (
      theme,
      { showMenu, location }: { showMenu: boolean; location: Location },
      getRef
    ) => ({
      inner: {
        flexGrow: 1,
        marginTop: `${
          showMenu
            ? location.pathname.startsWith("/orders")
              ? `${MENU_HEIGHT * 2}px`
              : `${MENU_HEIGHT}px`
            : 0
        }`,
        marginBottom: `${MENU_HEIGHT}px`,
        transition: "margin-top 0.2s",
        transform: "translate3d(0, 0, 0)",
        maxWidth: "100%",

        // maxWidth: `${`calc(100% - ${
        //   isMobile ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED
        // }px)`}`,
      },
    })
  );
  const { classes } = useStyles({ showMenu, location });
  return <Box className={classes.inner}>{children as any}</Box>;
};

const Menu: React.FC = ({ children }) => {
  const [opened, setOpened] = useState(false);
  const { cart } = useCart();
  const theme = useMantineTheme();
  const isMobile = !!theme.fn.largerThan("md");

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { userId, loggedIn, setUserDocument } = useUser();
  const { data: userData, isLoading } = useGetUserDocument({
    userId,
    setUserDocument,
  });
  console.log("🚀 ~ file: Menu.tsx:134 ~ userData", userData);
  const [links, bottomNavLinks] = useConfigurationData();
  const location = useRouteLocation();
  // const { search, setSearch, searchMode, setSearchMode, hits } = useSearch();
  const [{ city, country, coords }, setLocation] = useLocation();
  const isBigEnough = useMediaQuery(
    theme.fn.largerThan("sm").replace("@media", "")
  );
  useUserCheck();
  const { i18n } = useTranslation();
  const { countries, cities } = getCountryInfo();
  const { refetch } = useRefreshBalance();
  useEffect(() => {
    if (loggedIn) {
      refetch();
    }
  }, [location.pathname]);

  const [locationPopoverOpened, setLocationPopoverOpen] = useState(false);
  const form = useForm({
    initialValues: {
      city,
      country,
      coords: `${coords[0]},${coords[1]}`,
    },
  });
  useEffect(() => {
    form.setValues({
      city,
      country,
      coords: `${coords[0]},${coords[1]}`,
    });
  }, [city, country, coords]);

  const err = (e) => {
    alert(e);
  };
  const success = (res) => {
    form.setFieldValue(
      "coords",
      `${res.coords.latitude}, ${res.coords.longitude}`
    );
    //alert(`lat: ${res.coords.latitude}, long: ${res.coords.longitude}`);
  };

  /**
   * http://localhost:3000/62949a365aae3db6bef03a1b/Libya/Tripoli/629a36b012684cfd57a0dfaf
http://localhost:3000/62949a365aae3db6bef03a1b/Libya/Tripoli/629a36b012684cfd57a0dfaf
  */
  console.log(loggedIn);

  // const [productCount, set] = usePersistState([], { localStorageKey: "cart" });
  const count = Object.keys(cart).reduce((acc, key) => {
    const store = cart[key];
    if (!store.addedProducts) {
      return 0;
    }
    return (
      acc +
      Object.keys(store?.addedProducts).reduce((acc, key) => {
        return acc + 1;
      }, 0)
    );
  }, 0);

  const [fixedComponent] = useFixedComponent();
  const FixedComponenet =
    fixedComponent.length > 0 ? fixedComponent[0] : undefined;
  const [visible, setVisible] = useState(false);
  return (
    <Wrapper>
      <StyledNav>
        {loggedIn ? (
          <Box
            style={{
              padding: "0px 16px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Burger
              opened={opened}
              onClick={() => setOpened((prevState) => !prevState)}
            />
            <Space
              sx={{
                width: "48px",
              }}
            />

            <Group
              grow={!isBigEnough}
              sx={{
                width: "100%",

                margin: "auto ",
              }}
            >
              {location.pathname !== "/explore" && (
                <Popover
                  opened={locationPopoverOpened}
                  onClose={() => setLocationPopoverOpen(false)}
                  trapFocus={false}
                  position={"bottom"}
                  withArrow={false}
                  closeOnClickOutside={false}
                >
                  <Popover.Target>
                    <Box
                      sx={(theme) => ({
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      })}
                    >
                      <Button
                        onClick={() => setLocationPopoverOpen((prev) => !prev)}
                        variant="subtle"
                        rightIcon={<AiOutlineArrowDown />}
                      >
                        {" "}
                        {t(`In ${city}`)}
                      </Button>
                    </Box>
                  </Popover.Target>
                  <Popover.Dropdown
                    sx={{
                      zIndex: 1000,
                    }}
                  >
                    <form
                      onSubmit={form.onSubmit((values) => {
                        console.log(values.coords);
                        const newCoords = values.coords.split(",");

                        setLocation({
                          ...values,
                          coords: [
                            parseFloat(newCoords[0]),
                            parseFloat(newCoords[1]),
                          ],
                        });
                      })}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Card.Section>
                          <Group spacing={"sm"} position={"center"} grow={true}>
                            <Select
                              label={"Country"}
                              data={countries}
                              aria-label="Country"
                              required
                              {...form.getInputProps("country")}
                            />
                            <Select
                              label={t("City")}
                              data={cities}
                              aria-label="City"
                              required
                              {...form.getInputProps("city")}
                            />
                          </Group>

                          <TextInput
                            label={"coords"}
                            {...form.getInputProps("coords")}
                          />
                          <Button
                            fullWidth
                            mt={28}
                            variant="outline"
                            onClick={() => {
                              navigator.geolocation.getCurrentPosition(
                                success,
                                err
                              );
                            }}
                          >
                            {t("Get current coords")}
                          </Button>
                        </Card.Section>
                        <Card.Section
                          sx={{
                            marginTop: "12px",
                            display: "flex",
                            flexDirection: "row-reverse",
                          }}
                        >
                          <Button fullWidth type="submit">
                            {t("set Location")}
                          </Button>
                        </Card.Section>
                      </Card>
                    </form>
                  </Popover.Dropdown>
                </Popover>
              )}
              {(isBigEnough || location.pathname === "/explore") && (
                <></>
                // <Popover
                //   opened={popoverOpened && hits?.length > 0 && isBigEnough && searchMode}
                //   onClose={() => setPopoverOpened(false)}
                //   sx={{
                //     zIndex: 1000,
                //     minWidth: '60%',
                //   }}
                //   styles={{
                //     popover: {
                //       maxWidth: '100%',
                //     },
                //   }}
                //   trapFocus={false}
                //   target={
                //     <TextInput
                //       onFocus={() => {
                //         if (location.pathname !== '/explore') {
                //           setPopoverOpened(true);
                //           setSearchMode(true);
                //         }
                //       }}
                //       placeholder={t('explore products and stores in your city')}
                //       value={search}
                //       onChange={(e) => setSearch(e.currentTarget.value)}
                //     />
                //   }
                //   width={'100%'}
                //   position={'bottom'}
                //   withArrow={false}
                // >
                //   <Box
                //     sx={{
                //       width: '100%',
                //       display: 'flex',
                //       flexDirection: 'column',
                //     }}
                //   >
                //     {hits?.length > 0 &&
                //       hits.map((hit) => (
                //         <UnstyledButton
                //           component={Link}
                //           to={`/${hit.storeId}/${country}/${city}/${hit.id}`}
                //           sx={(theme) => ({
                //             height: '34px',
                //             ['&:hover']: {
                //               backgroundColor:
                //                 theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.gray[9],
                //             },
                //             ...theme.fn.focusStyles(),
                //           })}
                //         >
                //           {hit.title}
                //         </UnstyledButton>
                //       ))}
                //   </Box>
                // </Popover>
              )}
            </Group>

            <Box
              component={Link}
              to={"/cart"}
              style={{
                textDecoration: "none",
              }}
            >
              <Box
                sx={{
                  width: "56px",
                  height: "38px",
                  background:
                    theme.colorScheme === "dark"
                      ? theme.colors.green[8]
                      : theme.colors.green[6],
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MdShoppingCart
                  style={{ padding: " 0px 6px" }}
                  size={32}
                  color={"white"}
                />
                <Text size="lg" weight={600} color={"white"}>
                  {count}
                </Text>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            p={"sm"}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "6vw",
              }}
            >
              <Text
                weight={700}
                size={"5vw"}
                sx={(theme) => ({
                  fontFamily: "sans-serif",

                  [theme.fn.largerThan("md")]: {
                    fontSize: "34px",
                  },
                })}
              >
                hyfn
              </Text>
            </Box>

            <Group>
              <Button
                sx={{
                  borderRadius: "18px",
                }}
                variant="light"
              >
                {t("Login")}
              </Button>
              <Button
                sx={{
                  borderRadius: "18px",
                }}
              >
                {t("Signup")}
              </Button>
            </Group>
          </Box>
        )}
      </StyledNav>
      {loggedIn && location.pathname.startsWith("/orders") && (
        <Box
          sx={{
            zIndex: 3,
            width: "100%",
            position: "fixed",
            top: `${MENU_HEIGHT}px`,
          }}
        >
          <Container
            sx={{
              width: "100%",
              margin: "0px auto",
              height: 60,
              justifyContent: "space-around",
              alignItems: "center",
              display: "flex",
            }}
          >
            <Button
              variant="outline"
              sx={{
                width: "45%",
              }}
              component={Link}
              to={"/orders/activeorders"}
            >
              {t("Active Orders")}
            </Button>
            <Button
              variant="outline"
              sx={{
                width: "45%",
              }}
              component={Link}
              to={"/store/orders/orderhistory"}
            >
              {t("History")}
            </Button>
          </Container>
        </Box>
      )}
      {isMobile && loggedIn && (
        <Box
          sx={{
            position: "fixed",
            bottom: "0px",
            width: "100%",
            zIndex: 20,
          }}
        >
          {fixedComponent.length > 0 &&
            (location.pathname.includes("product") ||
              (location.pathname.includes("product") &&
                location.pathname.includes("withnoptions"))) && (
              <FixedComponenet />
            )}

          <BottomNav
            theme={theme}
            links={bottomNavLinks}
            activeLink={location.pathname}
          />
        </Box>
      )}
      <BodyWrapper>
        <LoadingOverlay
          sx={{
            height: "100vh",
          }}
          visible={visible}
        />
        {loggedIn && (
          <Drawer
            withCloseButton={false}
            zIndex={4}
            padding={"md"}
            opened={opened}
            onClose={() => {
              setOpened(false);
            }}
            closeOnClickOutside
          >
            <Stack
              sx={{
                marginTop: "56px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {links.map((section) => {
                const SVG = section.svg;

                if (section.link) {
                  const boxprops: any =
                    section.type === "a"
                      ? {
                          component: "a",
                          target: "_blank",
                          rel: "noreferrer",
                          href: section.link,
                        }
                      : { component: Link, to: section.link };
                  return (
                    <Box
                      {...boxprops}
                      key={section.label}
                      sx={{
                        padding: " 6px 28px",
                        textDecoration: "none",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor:
                          theme.colorScheme === "dark" &&
                          location.pathname === section.link
                            ? theme.colors.dark[0]
                            : theme.colorScheme === "dark" &&
                              !(location.pathname === section.link)
                            ? theme.colors.dark[7]
                            : theme.colorScheme === "light" &&
                              location.pathname === section.link
                            ? theme.colors.dark[7]
                            : theme.white,
                        color:
                          theme.colorScheme === "dark" &&
                          location.pathname === section.link
                            ? theme.black
                            : theme.colorScheme === "dark" &&
                              !(location.pathname === section.link)
                            ? theme.white
                            : theme.colorScheme === "light" &&
                              location.pathname === section.link
                            ? theme.white
                            : theme.black,
                        "&:hover": {
                          backgroundColor:
                            theme.colorScheme === "light"
                              ? theme.colors.gray[2]
                              : theme.colors.gray[9],
                        },
                        borderRadius: "8px",
                      }}
                    >
                      {SVG ? (
                        <SVG
                          size={19}
                          style={{
                            marginRight: "8px",
                          }}
                        />
                      ) : (
                        "no svg"
                      )}
                      {section.label}
                    </Box>
                  );
                }
                return (
                  <UnstyledButton
                    onClick={async () => {
                      setVisible(true);
                      await section.function();
                      setVisible(false);
                    }}
                    sx={{
                      padding: " 6px 28px",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",

                      color:
                        theme.colorScheme === "dark"
                          ? theme.white
                          : theme.black,
                      "&:hover": {
                        backgroundColor:
                          theme.colorScheme === "light"
                            ? theme.colors.gray[2]
                            : theme.colors.gray[9],
                      },
                      borderRadius: "8px",
                    }}
                  >
                    {SVG ? (
                      <SVG
                        size={19}
                        style={{
                          marginRight: "8px",
                        }}
                      />
                    ) : (
                      "no svg"
                    )}{" "}
                    {section.label}
                  </UnstyledButton>
                );
              })}

              <TransactionList menu />
              <Group
                position="apart"
                sx={{
                  // position: "absolute",
                  bottom: 24 + MENU_HEIGHT,
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Group>
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <Text weight={700}>
                      {" "}
                      {`${t("Balance")}: ${
                        typeof userData?.balance?.toFixed(2) !== "undefined"
                          ? userData?.balance?.toFixed(2)
                          : 0
                      }`}
                    </Text>
                  )}
                </Group>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <AvatarMenu>
                    <AvatarMenu.Target>
                      <ActionIcon>
                        <MdLanguage />
                      </ActionIcon>
                    </AvatarMenu.Target>
                    <AvatarMenu.Dropdown>
                      {Object.keys(lngs).map((lang) => (
                        <AvatarMenu.Item
                          onClick={() => {
                            i18n.changeLanguage(lang);
                          }}
                        >
                          {lngs[lang].nativeName}
                        </AvatarMenu.Item>
                      ))}
                    </AvatarMenu.Dropdown>
                  </AvatarMenu>
                  <Space
                    sx={{
                      width: "12px",
                    }}
                  />
                  <ActionIcon
                    variant="outline"
                    color={dark ? "yellow" : "blue"}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                  >
                    {dark ? <BsSun size={18} /> : <BsMoonStars size={18} />}
                  </ActionIcon>
                </Box>
              </Group>
            </Stack>
          </Drawer>
        )}{" "}
        <Inner showMenu location={location} isMobile={isMobile}>
          {children}
        </Inner>
      </BodyWrapper>
    </Wrapper>
  );
};
export default Menu;
