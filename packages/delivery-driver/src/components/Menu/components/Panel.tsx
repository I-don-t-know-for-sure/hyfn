import { Box, createStyles } from "@mantine/core";
import { LinkProps, SIDEBAR_WIDTH_FULL } from "../config";
import PanelBody from "./PanelBody";

const Panel: React.FC<{ showMenu: boolean; links: LinkProps[] }> = ({
  children,
  showMenu,
  links,
}) => {
  const useStyles = createStyles((theme, _Params, getRef) => ({
    panel: {
      position: "fixed",
      paddingTop: `${showMenu ? "80px" : 0}`,
      top: 0,
      left: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      flexShrink: 0,

      width: `${`${SIDEBAR_WIDTH_FULL}px`}`,
      height: "100vh",
      borderRight: "2px solid rgba(133, 133, 133, 0.1)",
      zIndex: 16,
      overflow: `${"initial"}`,
    },
  }));
  const { classes } = useStyles();
  return (
    <Box className={classes.panel}>
      <PanelBody links={links} />
    </Box>
  );
};

export default Panel;
