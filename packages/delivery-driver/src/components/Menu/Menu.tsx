import {
  ActionIcon,
  Box,
  BoxProps,
  Burger,
  Button,
  Card,
  Container,
  createStyles,
  Drawer,
  Group,
  Popover,
  Select,
  Space,
  Menu as AvatarMenu,
  TextInput,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
  LoadingOverlay,
  Text,
  Stack,
} from "@mantine/core";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Link, useLocation as useRouteLocation } from "react-router-dom";

import { MdLanguage, MdLogout, MdShoppingCart } from "react-icons/md";

import {
  getCountryInfo,
  lngs,
  MENU_HEIGHT,
  useConfigurationData,
} from "./config";

import { BsMoonStars, BsSun } from "react-icons/bs";

import { AiOutlineArrowDown } from "react-icons/ai";
import {
  useLocation,
  useUpdateLocation,
} from "contexts/locationContext/LocationContext";
import { t } from "utils/i18nextFix";

import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useUserCheck } from "hooks/useUserCheck";
import TransactionList from "components/TransactionList";
import { useGetUserInfo } from "hooks/useGetUserInfo";
import { Auth } from "aws-amplify";
import { USER_DOCUMENT } from "config/constants";
import { useQueryClient } from "react-query";
import { useUser } from "contexts/userContext/User";
import CreateAccountModal from "components/CreateAccountModal";
import { CopyButton } from "hyfn-client";

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
      {children}
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
  return <Box className={classes.wrapper}>{children}</Box>;
};

const BodyWrapper: React.FC = ({ children }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    bodyWrapper: {
      position: "relative",
      display: "flex",
    },
  }));
  const { classes } = useStyles();
  return <Box className={classes.bodyWrapper}>{children}</Box>;
};

const Inner: React.FC<{ showMenu: boolean; isMobile: boolean }> = ({
  children,
  showMenu,
  isMobile,
}) => {
  const useStyles = createStyles(
    (theme, { showMenu }: { showMenu: boolean }, getRef) => ({
      inner: {
        flexGrow: 1,
        marginTop: `${showMenu ? `${MENU_HEIGHT}px` : 0}`,
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
  const { classes } = useStyles({ showMenu });
  return <Box className={classes.inner}>{children}</Box>;
};

const Menu: React.FC = ({ children }) => {
  // const { user } = useRealmApp()
  const {
    userDocument: user,
    loggedIn,
    setUserDocument: setUser,
    signOut,
  } = useUser();

  console.log("🚀 ~ file: Menu.tsx:118 ~ user", user);
  const [opened, setOpened] = useState(false);

  const theme = useMantineTheme();
  const isMobile = !!theme.fn.largerThan("md");

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { i18n } = useTranslation();
  const [links] = useConfigurationData();
  const location = useRouteLocation();
  const queryClient = useQueryClient();
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  useUserCheck({
    opened: createAccountModalOpen,
    setOpened: setCreateAccountModalOpen,
  });

  const isBigEnough = useMediaQuery(
    theme.fn.largerThan("sm").replace("@media", "")
  );
  const [{ city, country, coords }, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);

  const [locationPopoverOpened, setLocationPopoverOpen] = useState(false);
  console.log(coords[0]);

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
      coords: `${coords[0]},${coords[1]}`,
      country,
    });
  }, [coords]);

  const { countries, cities } = getCountryInfo();
  const { mutate } = useUpdateLocation();

  const err = (e) => {
    alert(e);
  };
  const success = (res) => {
    console.log(`${res.coords.latitude},${res.coords.longitude}`);

    form.setFieldValue(
      "coords",
      `${res.coords.latitude},${res.coords.longitude}`
    );
    //alert(`lat: ${res.coords.latitude}, long: ${res.coords.longitude}`);
  };

  /**
   * http://localhost:3000/62949a365aae3db6bef03a1b/Libya/Tripoli/629a36b012684cfd57a0dfaf
http://localhost:3000/62949a365aae3db6bef03a1b/Libya/Tripoli/629a36b012684cfd57a0dfaf
  */

  // const [productCount, set] = usePersistState([], { localStorageKey: "cart" });

  return (
    <Wrapper>
      {loggedIn && (
        <StyledNav>
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
                        variant="subtle"
                        onClick={() => setLocationPopoverOpen((prev) => !prev)}
                        rightIcon={<AiOutlineArrowDown />}
                      >
                        {" "}
                        {t("In")} {city}
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
                        const modifiedCoords = values.coords.split(",");

                        setLocation({
                          ...values,
                          coords: [+modifiedCoords[0], +modifiedCoords[1]],
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
                              label={t("Country")}
                              data={countries}
                              aria-label="Country"
                              required
                              {...form.getInputProps("country")}
                            />
                            <Select
                              label={t("City")}
                              data={
                                cities[form.values.country]
                                  ? cities[form.values.country]
                                  : []
                              }
                              aria-label="City"
                              required
                              {...form.getInputProps("city")}
                            />
                          </Group>
                          <Group>
                            <TextInput
                              style={{
                                width: "75%",
                              }}
                              label={t("coords")}
                              {...form.getInputProps("coords")}
                            />
                            <Button
                              mt={28}
                              variant="outline"
                              onClick={() => {
                                navigator.geolocation.getCurrentPosition(
                                  success,
                                  err
                                );
                              }}
                            >
                              {t("current coords")}
                            </Button>
                          </Group>
                        </Card.Section>
                        <Card.Section
                          sx={{
                            marginTop: "12px",
                            display: "flex",
                            flexDirection: "row-reverse",
                          }}
                        >
                          <Button type="submit">{t("set Location")}</Button>
                        </Card.Section>
                      </Card>
                    </form>
                  </Popover.Dropdown>
                </Popover>
              )}
            </Group>
          </Box>
        </StyledNav>
      )}

      <BodyWrapper>
        {createAccountModalOpen && (
          <CreateAccountModal
            opened={createAccountModalOpen}
            setOpened={setCreateAccountModalOpen}
          />
        )}
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
            style={{
              justifyContent: "space-around",
            }}
            padding={"md"}
            opened={opened}
            onClose={() => {
              setOpened(false);
            }}
            closeOnClickOutside
          >
            <Stack
              justify="space-around"
              sx={{
                marginTop: "56px",
                // display: "flex",
                // justifyContent: "space-around",
                // flexDirection: "column",
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
                    key={section.label}
                    onClick={async () => {
                      setVisible(true);
                      await section.function();
                      console.log("hsbhsbchdbchdbchdbc");

                      setVisible(false);
                      console.log(
                        "hsbhsbchdbcjndjncjdncjdcjndjcnjdncnhdbchdbc"
                      );
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
              {/* <UnstyledButton
                sx={{
                  padding: ' 6px 28px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',

                  color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                  '&:hover': {
                    backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.gray[9],
                  },
                  borderRadius: '8px',
                }}
                onClick={async () => {
                  signOut()
                  navigate('/signup', { replace: true })
                }}
              >
                <MdLogout
                  size={19}
                  style={{
                    marginRight: '8px',
                  }}
                />
                {t('Logout')}
              </UnstyledButton> */}
              <TransactionList menu />

              <Group
                position="apart"
                sx={{
                  // position: 'absolute',
                  bottom: 24 + MENU_HEIGHT,
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CopyButton value={user?._id} />
                <Group>
                  <Text weight={700}>{`${t("Balance")}: ${
                    typeof user?.balance?.toFixed(2) !== "undefined"
                      ? user?.balance?.toFixed(2)
                      : 0
                  }`}</Text>
                </Group>
                <Group>
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
                  {/* <Space
                  sx={{
                    width: '12px',
                  }}
                /> */}
                  <ActionIcon
                    variant="outline"
                    color={dark ? "yellow" : "blue"}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                  >
                    {dark ? <BsSun size={18} /> : <BsMoonStars size={18} />}
                  </ActionIcon>
                </Group>
              </Group>
            </Stack>
          </Drawer>
        )}{" "}
        <Inner showMenu isMobile={isMobile}>
          {children}
        </Inner>
      </BodyWrapper>
    </Wrapper>
  );
};
export default Menu;
