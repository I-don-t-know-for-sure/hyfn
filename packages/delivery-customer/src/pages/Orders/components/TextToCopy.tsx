import { ActionIcon, Group, Text } from "hyfn-client";
import { useClipboard } from "@mantine/hooks";
import React from "react";
import { IoMdCopy } from "react-icons/io";
import { t } from "util/i18nextFix";

interface TexttoCopyProps {
  textToCopy: string;
}

const TextToCopy: React.FC<TexttoCopyProps> = ({ textToCopy }) => {
  const clipboard = useClipboard({ timeout: 1500 });

  return (
    <Group
      sx={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
      }}
    >
      <ActionIcon
        onClick={() => {
          clipboard.copy(textToCopy);
        }}
      >
        {clipboard.copied ? (
          <Text color={"teal"}>{t("Copied")}</Text>
        ) : (
          <IoMdCopy size={24} />
        )}
      </ActionIcon>
      <Text>{textToCopy}</Text>
    </Group>
  );
};

export default TextToCopy;
