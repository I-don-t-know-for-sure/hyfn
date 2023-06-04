import { Button, Modal } from "@mantine/core";
import React, { useState } from "react";
import { t } from "util/i18nextFix";

interface ManagementInfoModalProps {
  managementId: string;
}

const ManagementInfoModal: React.FC<ManagementInfoModalProps> = ({
  managementId,
}) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal onClose={() => setOpened(false)} opened={opened}></Modal>
      <Button
        sx={{
          verticalAlign: "bottom",
        }}
      >
        {t("Management Info")}
      </Button>
    </>
  );
};

export default ManagementInfoModal;
