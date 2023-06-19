import { showNotification } from "@mantine/notifications";
import { useUser } from "contexts/userContext/User";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { AiFillHome, AiFillTag } from "react-icons/ai";
import { MdLogout, MdReceipt, MdSettings } from "react-icons/md";
import { useNavigate } from "react-router";

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

  const navigate = useNavigate();

  const links: LinkProps[] = [
    { label: t("Home"), link: "/", icon: AiFillHome },

    {
      label: t("Orders"),
      icon: MdReceipt,
      items: [
        {
          label: t("Active orders"),
          link: "/activeorders"
        },

        {
          label: t("Order history"),
          link: "/orderhistory"
        }
      ]
    },
    {
      label: t("Products"),
      icon: AiFillTag,
      items: [
        {
          label: t("Products"),
          link: "/products"
        },
        {
          label: t("Collections"),
          link: "/collections"
        }
      ]
    },

    {
      label: t("Settings"),
      icon: MdSettings,
      link: "/settings"
      // items: [
      //   {
      //     label: t('Store Information'),
      //     link: '/storeinfo',
      //   },

      //   {
      //     label: t('Payments'),
      //     link: '/payments',
      //   },
      // ],
    }
  ];

  const list = [
    {
      label: t("Log Out"),
      fn: async () => {
        await signOut();
      },
      icon: MdLogout
    },
    {
      label: t("set store as opened"),
      fn: () => {},
      icon: MdLogout
    }
  ];

  const lngs = {
    en: { nativeName: "English" },
    ar: { nativeName: "عربي" }
  };

  return { links, lngs, list };
};
