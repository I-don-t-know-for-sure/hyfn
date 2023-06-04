import { Button, Group, Modal } from "@mantine/core";
import { t } from "util/i18nextFix";
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useQRCodeReader } from "hyfn-client";
import { useConfirmPickup } from "hooks/useConfirmPickup";

interface DeliveredModalProps {
  orderId: string;
}

const DeliveredModal: React.FC<DeliveredModalProps> = ({ orderId }) => {
  const [opened, setOpened] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const { initializeCamera, stopCamera } = useQRCodeReader({
    setConfirmationCode,
  });
  const { mutate: confirmPickup } = useConfirmPickup();
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
        <Group position="apart">
          <Button onClick={initializeCamera}>{t("Scan QR code")}</Button>
          {confirmationCode && (
            <Button
              onClick={() => {
                confirmPickup({
                  pickupConfirmation: confirmationCode,
                  orderId,
                });
              }}
            >
              {t("Confirm pickup")}
            </Button>
          )}
        </Group>
      </Modal>

      <Button fullWidth onClick={() => setOpened(true)}>
        {t("Confirm pickup")}
      </Button>
    </>
  );
};

export default DeliveredModal;
