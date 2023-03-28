import { ActionIcon, Popover, Text } from "@mantine/core";
import { t } from 'utils/i18nextFix';
import React, { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";

interface InfoPopoverProps {
  infoText: string;
}

const InfoPopover: React.FC<InfoPopoverProps> = ({ infoText }) => {
  const [opened, setOpened] = useState(false);
  return (
    <Popover
      position="bottom"
      sx={{
        maxWidth: "350px",
      }}
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <ActionIcon onClick={() => setOpened(true)}>
          <BsInfoCircle size={22} />
        </ActionIcon>
      }
    >
      <Text
        sx={{
          maxWidth: "350px",
        }}
      >
        {t(`${infoText}`)}
      </Text>
    </Popover>
  );
};

export default InfoPopover;
