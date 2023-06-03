import { Badge, Button, Group, Modal, Stack } from "hyfn-client";
import { useUser } from "contexts/userContext/User";
import { usePickupOrder } from "hooks/usePickupOrder";
import { useQRCodeReader } from "hyfn-client";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";

interface PickupOrderModalProps {
  pickedUp: boolean;
  orderId: string;
  storeId: string;
}

const PickupOrderModal: React.FC<PickupOrderModalProps> = ({
  pickedUp,
  orderId,
  storeId,
}) => {
  const [opened, setOpened] = useState(false);
  const { userDocument } = useUser();
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
        <Stack>
          <div id="reader"></div>
          <Button onClick={() => initializeCamera()}>{t("Scan")}</Button>
          {(confirmationCode || storeId === userDocument.driverManagement) && (
            <Button
              onClick={() =>
                pickupOrder({ confirmationCode, orderId: orderId })
              }
            >
              {t("Pickup")}
            </Button>
          )}
        </Stack>
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
