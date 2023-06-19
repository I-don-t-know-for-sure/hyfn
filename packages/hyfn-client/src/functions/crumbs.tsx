import { Anchor, Text } from "@mantine/core";
import { t } from "i18next";
import React from "react";
export const crumbs = ({
  items
}: {
  items: { title: string; href: string }[];
}) => {
  return items.map((crumb, index) =>
    crumb.href === "" ? (
      <Text weight={700}>{t(crumb.title)}</Text>
    ) : (
      <Anchor href={crumb.href} key={index}>
        {crumb.title}
      </Anchor>
    )
  );
};
