import { Accordion, Box, Button, createStyles } from "hyfn-client";
import { Link } from "react-router-dom";

import { LinkProps } from "../config";

const PanelBody: React.FC<{ links: LinkProps[] }> = ({ links }) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    panelBody: {
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      overflowX: "hidden",
      height: "100%",
    },
  }));
  const { classes } = useStyles();
  return (
    <Box className={classes.panelBody}>
      {links.map((section) => {
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
          console.log(section.type);

          return (
            <Box
              {...boxprops}
              key={section.label}
              style={{ paddingLeft: "24px" }}
            >
              <Button type="button" variant="subtle">
                {section.label}
              </Button>
            </Box>
          );
        }
        return (
          <Accordion>
            <Accordion.Item value={section.label}>
              <Accordion.Control>{section.label}</Accordion.Control>
              {section?.items?.map((item) => (
                // <Link to={item.link} key={item.label}>
                //   <Button type="button" variant="subtle">
                //     {item.label}
                //   </Button>
                // </Link>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.facebook.com/109389375211277/posts/pfbid0BaKmwp7Bh5mGsHUmqiCmBc6vffJfCeVCUq91weA56U18nkgb42xyvAgdFnULgQYTl/"
                >
                  Go to KindaCode.com
                </a>
              ))}
            </Accordion.Item>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default PanelBody;
