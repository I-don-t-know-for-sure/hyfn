import { Button, Center, Container, Modal } from "@mantine/core";

import { useConfirmOrderDelivery } from "hooks/useDeliveryConfirmation";

import React, { useState } from "react";
import QRCode from "react-qr-code";
import { t } from "util/i18nextFix";

interface DeliveryConfirmationModalProps {
  orderId: string;
  confirmationCode: string;
}

const DeliveryConfirmationModal: React.FC<DeliveryConfirmationModalProps> = ({
  orderId,
  confirmationCode,
}) => {
  const [opened, setOpened] = useState(false);
  const { mutate } = useConfirmOrderDelivery();
  const [rating, setRating] = useState<number>();
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("Confirm")}
      >
        <Container>
          {/* <StarRating onRate={(newRating: number) => setRating(newRating)} />

          <Button onClick={() => mutate({ orderId, newRating: rating })}>
            {t("Rate and Confirm")}
          </Button> */}

          <Container sx={{ backgroundColor: "white" }}>
            <Center m={"sm"}>
              <QRCode
                style={{ margin: "10px auto" }}
                value={confirmationCode}
              />
            </Center>
          </Container>
        </Container>
      </Modal>
      <Button
        fullWidth
        m={"24px  auto 0px auto"}
        onClick={() => setOpened(true)}
        sx={{
          maxWidth: "450px",
        }}
      >
        {t("Confirm Delivery")}
      </Button>
    </>
  );
};

export default DeliveryConfirmationModal;
