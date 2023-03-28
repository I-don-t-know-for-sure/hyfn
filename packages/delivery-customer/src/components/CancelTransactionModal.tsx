import { Button, Modal, Stack, Text } from "@mantine/core";
import { useCancelTransaction } from "hooks/useCancelTransaction";
import { t } from "i18next";

import React, { useState } from "react";

interface CancelTransactionModalProps {
  transactionId: string;
}

const CancelTransactionModal: React.FC<CancelTransactionModalProps> = ({
  transactionId,
}) => {
  const [opened, setOpened] = useState(false);
  const { mutate: cancelTransaction } = useCancelTransaction();
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack>
          <Text weight={700}>{t("This action is not recommended")}</Text>
          <Button
            color="red"
            onClick={() => {
              cancelTransaction({ transactionId });
            }}
            fullWidth
          >
            {t("Cancel")}
          </Button>
        </Stack>
      </Modal>
      <Button variant="light" color="red" onClick={() => setOpened(true)}>
        {t("Cancal")}
      </Button>
    </>
  );
};

export default CancelTransactionModal;
