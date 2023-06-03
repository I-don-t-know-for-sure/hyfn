import { ActionIcon, Popover, Text } from "hyfn-client";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";

interface InfoPopoverProps {
  infoText: string;
}

const InfoPopover: React.FC<InfoPopoverProps> = ({ infoText }) => {
  const [opened, setOpened] = useState(false);
  return (
    <Popover position="bottom" opened={opened} onClose={() => setOpened(false)}>
      <Popover.Target>
        <ActionIcon onClick={() => setOpened(true)}>
          <BsInfoCircle size={22} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown
        sx={{
          maxWidth: "350px",
        }}
      >
        <Text
          sx={{
            maxWidth: "350px",
          }}
        >
          {t(`${infoText}`)}
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default InfoPopover;
