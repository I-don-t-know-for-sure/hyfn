import { Badge, Button, Group, Modal } from "@mantine/core";
import { usePickupOrder } from "hooks/usePickupOrder";
import { useQRCodeReader } from "hyfn-client";
import { t } from "i18next";
import React, { useState } from "react";

interface PickupOrderModalProps {
  pickedUp: boolean;
  orderId: string;
}

const PickupOrderModal: React.FC<PickupOrderModalProps> = ({
  pickedUp,
  orderId,
}) => {
  const [opened, setOpened] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const { initializeCamera, stopCamera } = useQRCodeReader({
    setConfirmationCode,
  });
  const { mutate: pickupOrder } = usePickupOrder();
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          stopCamera();
          setOpened(false);
        }}
      >
        <div id="reader"></div>
        <Group grow>
          <Button onClick={() => initializeCamera()}>{t("Scan")}</Button>
          <Button
            onClick={() => pickupOrder({ confirmationCode, orderId: orderId })}
          >
            {t("Pickup")}
          </Button>
        </Group>
      </Modal>
      {pickedUp ? (
        <Badge color="green">{t("Picked")}</Badge>
      ) : (
        <Button onClick={() => setOpened(true)}>{t("Pickup")}</Button>
      )}
    </>
  );
};

export default PickupOrderModal;
