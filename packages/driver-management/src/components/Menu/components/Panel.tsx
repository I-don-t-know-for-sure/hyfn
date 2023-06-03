import { createStyles } from "hyfn-client";
import { LinkProps, Lngs, SIDEBAR_WIDTH_FULL } from "../config";
import PanelBody from "./PanelBody";
import { ReactNode } from "react";
import { ReactProps } from "config/types";

interface PanelProps extends ReactProps {
  showMenu: boolean;
  links: LinkProps[];
  lngs: Lngs;
  activeLink: string;
}
const Panel: React.FC<PanelProps> = ({
  children,
  showMenu,
  links,
  activeLink,
  lngs,
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
    <div className={classes.panel}>
      <PanelBody lngs={lngs} links={links} activeLink={activeLink} />
    </div>
  );
};

export default Panel;
