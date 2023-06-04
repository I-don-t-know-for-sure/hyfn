import { ActionIcon, Menu } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

interface TranslationProps {
  lngs: any;
}

const Translation: React.FC<TranslationProps> = ({ lngs }) => {
  const { i18n } = useTranslation();
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon>
          <MdLanguage />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {Object.keys(lngs).map((lang) => (
          <Menu.Item
            key={lang}
            onClick={() => {
              i18n.changeLanguage(lang);
            }}
          >
            {lngs[lang].nativeName}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default Translation;
