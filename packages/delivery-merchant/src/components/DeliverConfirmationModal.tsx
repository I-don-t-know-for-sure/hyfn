import { Button, Center, Container, Modal } from "hyfn-client";

import React, { useState } from "react";
import QRCode from "react-qr-code";
import { t } from "utils/i18nextFix";

interface DeliveryConfirmationModalProps {
  confirmationCode: string;
}

const DeliveryConfirmationModal: React.FC<DeliveryConfirmationModalProps> = ({
  confirmationCode,
}) => {
  const [opened, setOpened] = useState(false);

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
        {t("Confirm Pickup")}
      </Button>
    </>
  );
};

export default DeliveryConfirmationModal;
