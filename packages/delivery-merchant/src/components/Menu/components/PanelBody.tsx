import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Container,
  createStyles,
  Menu,
  Space,
  Text,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "hyfn-client";
import { useTranslation } from "react-i18next";
import { AiFillTag } from "react-icons/ai";
import { BsMoonStars, BsSun } from "react-icons/bs";
import { MdLanguage } from "react-icons/md";

import { Link } from "react-router-dom";

import { LinkProps, Lngs } from "../config";

const PanelBody: React.FC<{
  links: LinkProps[];
  activeLink: string;
  lngs: Lngs;
}> = ({ links, activeLink, lngs }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    panelBody: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing.xs,
      overflowY: "auto",
      overflowX: "hidden",
      height: "80vh",
      justifyContent: "space-between",
    },
  }));

  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { i18n } = useTranslation();
  return (
    <Box className={classes.panelBody}>
      <Box>
        {links.map((section) => {
          const Icon = section.icon;
          if (section.link) {
            return (
              <UnstyledButton
                component={Link}
                to={section.link}
                key={section.label}
                sx={{
                  padding: " 12px 12px",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  fontWeight: 500,
                  color:
                    activeLink === section.link
                      ? theme.primaryColor
                      : "-moz-initial",
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[5]
                        : theme.colors.gray[0],
                  },
                }}
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
              key={section.link}
              chevron={<></>}

              // sx={{
              //   display: 'flex',
              //   flexDirection: 'column',
              //   justifyContent: 'space-between',

              //   width: '100%',
              // }}
            >
              <Accordion.Item
                value={section.label}
                sx={{
                  border: "0px",
                }}
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
                      sx={{
                        padding: " 12px 12px",
                        textDecoration: "none",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        fontWeight: 500,
                        color: activeLink.includes(
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
                      }}
                    >
                      {item.label}
                    </UnstyledButton>
                  ))}
                </Box>
              </Accordion.Item>
            </Accordion>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Menu>
          <Menu.Target>
            <ActionIcon>
              <MdLanguage />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {Object.keys(lngs).map((lang) => (
              <Menu.Item
                onClick={() => {
                  i18n.changeLanguage(lang);
                }}
              >
                {lngs[lang].nativeName}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
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
    </Box>
  );
};

export default PanelBody;
