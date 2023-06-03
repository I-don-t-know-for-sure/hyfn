import { Box, MantineTheme, Text, UnstyledButton } from "hyfn-client";
import React from "react";
import { Link } from "react-router-dom";
import { LinkProps, MENU_HEIGHT } from "../config";

interface BottomNavProps {
  links: LinkProps[];
  activeLink: string;

  theme: MantineTheme;
}

const BottomNav: React.FC<BottomNavProps> = ({
  links,
  activeLink,

  theme,
}) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,

        padding: "5px 8px",
        display: "flex",
        flexDirection: "row",
        height: MENU_HEIGHT,
        justifyContent: "space-around",
        borderTop: "solid 2px rgba(133, 133, 133, 0.1)",
      })}
    >
      {links.map((section) => {
        const SVG = section.svg;

        if (section.link) {
          return (
            <Box
              component={Link}
              to={section.link}
              key={section.label}
              sx={{
                padding: " 6px 28px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                color:
                  theme.colorScheme === "dark" && activeLink === section.link
                    ? theme.white
                    : theme.colorScheme === "dark" &&
                      !(activeLink === section.link)
                    ? theme.colors.dark[1]
                    : theme.colorScheme === "light" &&
                      activeLink === section.link
                    ? theme.primaryColor
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
              {SVG ? <SVG size={19} style={{}} /> : "no svg"}
              <Text>{section.label}</Text>
            </Box>
          );
        }
      })}

      {/* <UnstyledButton
          sx={(theme) => ({
            display: "block",
            border: 0,

            cursor: "pointer",
            height: "44px",
            padding: "4px 12px",
            "&:hover": {
              borderRadius: "16px",
              background:
                theme.colorScheme === "light"
                  ? theme.colors.gray[2]
                  : theme.colors.gray[9],
            },
          })}
        >
          test
        </UnstyledButton> */}
    </Box>
  );
};

export default BottomNav;
