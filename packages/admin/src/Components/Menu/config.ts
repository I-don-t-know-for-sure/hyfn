import { showNotification } from "@mantine/notifications";

import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { AiFillHome, AiFillTag } from "react-icons/ai";
import { MdLogout, MdReceipt, MdSettings } from "react-icons/md";
import { useNavigate } from "react-router";
import { useUser } from "../../contexts/userContext/User";

export const MENU_HEIGHT = 64;
export const MENU_ENTRY_HEIGHT = 48;
export const SIDEBAR_WIDTH_FULL = 240;
export const SIDEBAR_WIDTH_REDUCED = 56;

export interface LinkProps {
  label: string;
  link?: string;
  icon: IconType;
  items?: { label: string; link: string }[];
}
interface Lang {
  nativeName: string;
}

export interface Lngs {
  en: Lang;
  ar: Lang;
}
export const useConfigData = () => {
  const { t } = useTranslation();
  const { userId, signOut } = useUser();

  const links: LinkProps[] = [
    { label: t("Home"), link: "/", icon: AiFillHome },
    { label: t("Verify Drivers"), link: "/verifyDrivers", icon: AiFillHome },
    { label: t("Reports"), link: "/reports", icon: AiFillHome },
    { label: t("Payment Requets"), link: "/paymentRequests", icon: AiFillHome },
  ];

  const list = [
    {
      label: t("Log Out"),
      fn: async () => {
        await signOut();
      },
      icon: MdLogout,
    },
    {
      label: t("set store as opened"),
      fn: () => {},
      icon: MdLogout,
    },
  ];

  const lngs = {
    en: { nativeName: "English" },
    ar: { nativeName: "عربي" },
  };

  return { links, lngs, list };
};
