import { Button, Group, Modal, Stack } from "hyfn-client";
import { t } from "utils/i18nextFix";
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useQRCodeReader } from "hyfn-client";
import { useUser } from "contexts/userContext/User";

interface DeliveredModalProps {
  delivered: ({ confirmationCode }: { confirmationCode: string }) => void;
  storeId: string;
}

const DeliveredModal: React.FC<DeliveredModalProps> = ({
  delivered,
  storeId,
}) => {
  const [opened, setOpened] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const { userDocument } = useUser();
  const { initializeCamera, stopCamera } = useQRCodeReader({
    setConfirmationCode,
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          stopCamera();
          setOpened(false);
        }}
      >
        <Stack>
          <div id="reader"></div>
          <Button onClick={initializeCamera}>{t("Scan QR code")}</Button>
          {(confirmationCode || storeId === userDocument.driverManagement) && (
            <Button
              onClick={() => {
                delivered({ confirmationCode });
              }}
            >
              {t("Set as delivered")}
            </Button>
          )}
        </Stack>
      </Modal>

      <Button fullWidth onClick={() => setOpened(true)}>
        {t("Set as delivered")}
      </Button>
    </>
  );
};

export default DeliveredModal;
