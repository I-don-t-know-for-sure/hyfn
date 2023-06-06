import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Card,
  Container,
  createStyles,
  Drawer,
  Group,
  Menu as AvatarMenu,
  Paper,
  Space,
  Text,
  Textarea,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
  LoadingOverlay,
} from "@mantine/core";
import { CopyButton, CopyTextButton } from "hyfn-client";
import { useMediaQuery, useWindowScroll } from "@mantine/hooks";
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { MdLanguage, MdLogout } from "react-icons/md";
import Panel from "./components/Panel";
import { MENU_HEIGHT, SIDEBAR_WIDTH_FULL, useConfigData } from "./config";
import { useTranslation } from "react-i18next";
import { BsMoonStars, BsSun } from "react-icons/bs";
import { t } from "utils/i18nextFix";

import { useUserCheck } from "hooks/useUserCheck";

import { useUser } from "contexts/userContext/User";

import { ReactProps } from "config/types";
import TransactionList from "components/TransactionList";

interface StyledNavProps extends ReactProps {}
const StyledNav: React.FC<StyledNavProps> = ({ children }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    styledNav: {
      position: "fixed",
      top: 0,
      left: 0,
      transition: "top 0.2s",
      display: "flex",
      [theme.fn.largerThan(900)]: {
        flexDirection: "row-reverse",
      },
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "8px",
      paddingRight: "16px",
      width: "100%",
      height: `${MENU_HEIGHT}px`,

      borderBottom: "solid 2px rgba(133, 133, 133, 0.1)",
      zIndex: 20,
      transform: "translate3d(0, 0, 0)",
    },
  }));

  const { classes } = useStyles();
  return <nav className={classes.styledNav}>{children}</nav>;
};
interface WrapperProps extends ReactProps {}
const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    wrapper: {
      position: "relative",

      width: "100%",
    },
  }));
  const { classes } = useStyles();
  return <Box className={classes.wrapper}>{children as any}</Box>;
};
interface BodyWrapperProps extends ReactProps {}
const BodyWrapper: React.FC<BodyWrapperProps> = ({ children }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    bodyWrapper: {
      position: "relative",

      display: "flex",
    },
  }));
  const { classes } = useStyles();
  return <Box className={classes.bodyWrapper}>{children as any}</Box>;
};
interface InnerProps extends ReactProps {
  showMenu: boolean;
  isMobile: boolean;
  loggedIn: boolean;
}
const Inner: React.FC<InnerProps> = ({
  children,
  showMenu,
  isMobile,
  loggedIn,
}) => {
  const useStyles = createStyles(
    (theme, { showMenu }: { showMenu: boolean }, getRef) => ({
      inner: {
        flexGrow: 1,
        marginTop: `${showMenu ? `${MENU_HEIGHT}px` : 0}`,
        transition: "margin-top 0.2s",
        transform: "translate3d(0, 0, 0)",

        maxWidth: "100%",

        marginLeft: `${!isMobile && loggedIn ? SIDEBAR_WIDTH_FULL : 0}px`,

        // maxWidth: `${`calc(100% - ${
        //   isMobile ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED
        // }px)`}`,
      },
    })
  );
  const { classes } = useStyles({ showMenu });
  return <Box className={classes.inner}>{children as any}</Box>;
};

const Menu: React.FC<ReactProps> = ({ children }) => {
  useUserCheck();
  const isXl = useMediaQuery("(min-width: 900px)");
  const isMobile = isXl === false;
  // const { user, logOut } = useRealmApp()
  const { userDocument, loggedIn, signOut } = useUser();

  const [visible, setVisible] = useState(false);

  const location = useLocation();
  const [, scrollTo] = useWindowScroll();
  const theme = useMantineTheme();
  const { i18n } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { links, lngs, list: avatarList } = useConfigData();
  const storeName = loggedIn ? userDocument?.managementName : "";

  useEffect(() => {
    scrollTo({ x: 0, y: 0 });
  }, [location]);

  const [opened, setOpened] = useState(false);
  return (
    <Wrapper>
      <StyledNav>
        {isMobile && loggedIn && (
          <Burger
            opened={opened}
            onClick={() => setOpened((prevState) => !prevState)}
          />
        )}
        {loggedIn && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {loggedIn && (
              <AvatarMenu
              // sx={{
              //   maxWidth: isMobile ? '120px' : '',
              // }}
              >
                <AvatarMenu.Target>
                  <Box
                    p={"xs"}
                    m={"0px 4px"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      maxWidth: isMobile ? "120px" : "",
                    }}
                  >
                    <Avatar
                      // sx={{
                      //   width: 'fit-content',
                      //   maxWidth: isMobile ? '120px' : '',
                      // }}
                      alt={storeName}
                    />
                    <Text
                      weight={500}
                      sx={{
                        padding: "1px 4px",
                        overflow: "hidden",
                      }}
                    >
                      {storeName}
                    </Text>
                  </Box>
                </AvatarMenu.Target>
                {/* {avatarList.map((avatarItem) => {
                const Icon = avatarItem.icon;
                return (
                  <AvatarMenu.Item
                  onClick={async () => await avatarItem.fn()}
                  icon={<Icon />}
                  >
                  {avatarItem.label}
                  </AvatarMenu.Item>
                  );
                })} */}
                <AvatarMenu.Dropdown>
                  <AvatarMenu.Item
                    onClick={async () => {
                      setVisible(true);
                      await signOut();
                      setVisible(false);
                    }}
                    icon={<MdLogout />}
                  >
                    {t("Log out")}
                  </AvatarMenu.Item>
                </AvatarMenu.Dropdown>
              </AvatarMenu>
            )}
          </Box>
        )}
      </StyledNav>

      <BodyWrapper>
        <LoadingOverlay
          sx={{
            height: "100vh",
          }}
          visible={visible}
        />
        {!isMobile && loggedIn && (
          <Panel
            lngs={lngs}
            showMenu
            links={links}
            activeLink={location.pathname}
          />
        )}
        {isMobile && loggedIn && (
          <Drawer
            withCloseButton={false}
            size="md"
            zIndex={4}
            padding={"sm"}
            opened={opened}
            style={{
              position: "relative",
            }}
            onClose={() => {
              setOpened(false);
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                overflow: "auto",
              }}
              mt={MENU_HEIGHT}
            >
              <Box
                sx={{
                  height: "fit-content",
                }}
              >
                {links.map((section) => {
                  const Icon = section.icon;
                  if (section.link) {
                    return (
                      <UnstyledButton
                        component={Link}
                        to={section.link}
                        key={section.label}
                        sx={(theme) => ({
                          padding: " 12px 12px",
                          textDecoration: "none",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          fontWeight: 500,
                          color:
                            location.pathname === section.link
                              ? theme.primaryColor
                              : "-moz-initial",
                          "&:hover": {
                            backgroundColor:
                              theme.colorScheme === "dark"
                                ? theme.colors.dark[5]
                                : theme.colors.gray[0],
                          },
                        })}
                      >
                        <Icon
                          style={{
                            marginRight: theme.spacing.md,
                          }}
                        />{" "}
                        {section.label}
                      </UnstyledButton>
                    );
                  }
                  return (
                    <Accordion
                      chevron={<></>}

                      // sx={{
                      //   display: 'flex',
                      //   flexDirection: 'column',
                      //   justifyContent: 'space-between',

                      //   width: '100%',
                      // }}
                    >
                      <Accordion.Item
                        sx={{
                          border: "0px",
                        }}
                        value={section.label}
                      >
                        <Accordion.Control icon={<Icon />}>
                          {section.label}
                        </Accordion.Control>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          {section.items.map((item) => (
                            <UnstyledButton
                              component={Link}
                              to={item.link}
                              key={item.label}
                              sx={(theme) => ({
                                padding: " 12px 12px",
                                textDecoration: "none",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                fontWeight: 500,
                                color: location.pathname.includes(
                                  item.link.toLowerCase().trim()
                                )
                                  ? theme.primaryColor
                                  : "-moz-initial",
                                "&:hover": {
                                  backgroundColor:
                                    theme.colorScheme === "dark"
                                      ? theme.colors.dark[5]
                                      : theme.colors.gray[0],
                                },
                              })}
                            >
                              {item.label}
                            </UnstyledButton>
                          ))}
                        </Box>
                      </Accordion.Item>
                    </Accordion>
                  );
                })}
                <TransactionList menu />
              </Box>

              <Group
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  width: "90%",
                  position: "absolute",
                  // left: "16px",
                  bottom: "16px",
                }}
              >
                {/* <Box sx={{
  maxWidth: ""
}}> */}

                <CopyTextButton value={userDocument?.id} />
                {/* </Box> */}

                {/* <Group>
                  <Text weight={700}>{`${t("Balance")}: ${
                    typeof user?.balance?.toFixed(2) !== "undefined"
                      ? user?.balance?.toFixed(2)
                      : 0
                  }`}</Text>
                </Group> */}
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

                <ActionIcon
                  variant="outline"
                  color={dark ? "yellow" : "blue"}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                >
                  {dark ? <BsSun size={18} /> : <BsMoonStars size={18} />}
                </ActionIcon>
              </Group>
            </Box>
          </Drawer>
        )}{" "}
        <Inner showMenu isMobile={isMobile} loggedIn={loggedIn}>
          {children}
        </Inner>
      </BodyWrapper>
    </Wrapper>
  );
};
export default Menu;
