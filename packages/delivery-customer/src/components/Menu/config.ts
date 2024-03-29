import { UnstyledButton } from "@mantine/core";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { AiFillBulb, AiFillHome } from "react-icons/ai";
import { FaStore } from "react-icons/fa";
import {
  MdAppRegistration,
  MdDeliveryDining,
  MdLocationOn,
  MdLogin,
  MdLogout,
  MdReceipt,
  MdSearch,
  MdSettings,
  MdSupportAgent
} from "react-icons/md";

import { t } from "util/i18nextFix";
import { useUser } from "contexts/userContext/User";

export const MENU_HEIGHT = 64;
export const MENU_ENTRY_HEIGHT = 48;
export const SIDEBAR_WIDTH_FULL = 240;
export const SIDEBAR_WIDTH_REDUCED = 56;

export interface LinkProps {
  label: string;
  link?: string;
  svg?: IconType;
  type?: string;
  function?: () => any;
  items?: { label: string; link: string }[];
}

export const useConfigurationData = () => {
  const { signOut } = useUser();
  const links: LinkProps[] = [
    {
      label: t("Home"),
      link: "/home",
      svg: AiFillHome
    },
    {
      label: t("Orders"),
      link: "/orders/activeorders",
      svg: MdReceipt
    },
    {
      label: t("account settings"),
      link: "/accountsettings",
      svg: MdSettings
    },
    {
      label: t("how the app works"),
      type: "a",
      link: "https://www.facebook.com/109389375211277/posts/pfbid027T9saJqTApHKSDF7c4fPxQbR6JUxZz4Ld28TXA1aVYfxeaNo8hJdc5iuF5SsFTSVl/",
      svg: AiFillBulb
    },
    {
      label: t("help"),
      type: "a",
      link: "https://www.facebook.com/109389375211277/posts/pfbid027T9saJqTApHKSDF7c4fPxQbR6JUxZz4Ld28TXA1aVYfxeaNo8hJdc5iuF5SsFTSVl/",
      svg: MdSupportAgent
    },
    // {
    //   label: t("addresses"),
    //   link: "/addresses",
    //   svg: MdLocationOn,
    // },

    {
      label: t("Become a partner store"),
      type: "a",
      link: "https://store.hyfn.xyz",
      svg: FaStore
    },
    {
      label: t("LogOut"),
      svg: MdLogout,
      type: "unstyledButton",
      function: signOut
    }
    // {
    //   label: t('SignUp'),
    //   svg: MdAppRegistration,
    //   link: '/signup',
    // },
    // {
    //   label: t('LogIn'),
    //   svg: MdLogin,
    //   link: '/login',
    // },
  ];

  const bottomNavLinks: LinkProps[] = [
    {
      label: t("Home"),
      link: "/home",
      svg: AiFillHome
    },
    // {
    //   label: t('Pickup'),
    //   link: '/pickup',
    //   svg: MdDeliveryDining,
    // },
    {
      label: t("Explore"),
      link: "/explore",
      svg: MdSearch
    },
    {
      label: t("Orders"),
      link: "/orders/activeorders",
      svg: MdReceipt
    }
  ];

  return [links, bottomNavLinks];
};

export const lngs = {
  en: { nativeName: "English" },
  ar: { nativeName: "عربي" }
};
export const getCountryInfo = () => {
  const countries = [{ label: "Libya", value: "Libya" }];
  const cities = [
    { label: t("Tripoli"), value: "Tripoli" },
    { label: t("Ajdabiya"), value: "Ajdabiya" },
    { label: t("Zuwara"), value: "Zuwara" },
    { label: t("Yafran"), value: "Yafran" },
    { label: t("Nalut"), value: "Nalut" },
    { label: t("Gharyan"), value: "Gharyan" },
    { label: t("Al_Bayda"), value: "Al Bayda" },
    { label: t("Bani_Walid"), value: "Bani Walid" },
    { label: t("Al_Marj"), value: "Al Marj" },
    { label: t("Mizda"), value: "Mizda" },
    { label: t("Benghazi"), value: "Benghazi" },
    { label: t("Awbari"), value: "Awbari" },
    { label: t("Tobruk"), value: "Tobruk" },
    { label: t("Al_Khums"), value: "Al Khums" },
    { label: t("Murzuk"), value: "Murzuk" },
    { label: t("Shahat"), value: "Shahat" },
    { label: t("Sabratah"), value: "Sabratah" },
    { label: t("Ghat"), value: "Ghat" },
    { label: t("Sirte"), value: "Sirte" },
    { label: t("Tajura"), value: "Tajura" },
    { label: t("Misrata"), value: "Misrata" },
    { label: t("Zawiya"), value: "Zawiya" },
    { label: t("Sabha"), value: "Sabha" },
    { label: t("Brak"), value: "Brak" },
    { label: t("Ghadamis"), value: "Ghadamis" },
    { label: t("Al_Abyar"), value: "Al Abyar" },
    { label: t("Tarhunah"), value: "Tarhunah" },
    { label: t("Derna"), value: "Derna" },
    { label: t("Waddan"), value: "Waddan" },
    { label: t("Awjila"), value: "Awjila" },
    { label: t("Suluq"), value: "Suluq" },
    { label: t("Zelten"), value: "Zelten" },
    { label: t("Qatrun"), value: "Qatrun" },
    { label: t("Al_Qubbah"), value: "Al Qubbah" },
    { label: t("Tocra"), value: "Tocra" },
    { label: t("Jalu"), value: "Jalu" },
    { label: t("Zliten"), value: "Zliten" },
    { label: t("Al_Jamīl"), value: "Al Jamīl" },
    { label: t("Brega"), value: "Brega" },
    { label: t("Farzougha"), value: "Farzougha" },
    { label: t("Sorman"), value: "Sorman" },
    { label: t("Msallata"), value: "Msallata" },
    { label: t("Kikla"), value: "Kikla" }
  ];
  return { countries, cities };
};
