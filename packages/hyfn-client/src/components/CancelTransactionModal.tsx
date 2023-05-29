import { Button, Modal, Stack, Text } from "@mantine/core";

import { t } from "i18next";

import React, { useState } from "react";

interface CancelTransactionModalProps {
  transactionId: string;
  useCancelTransaction: any;
}

const CancelTransactionModal: React.FC<CancelTransactionModalProps> = ({
  transactionId,
  useCancelTransaction,
}) => {
  const [opened, setOpened] = useState(false);
  const { mutate: cancelTransaction } = useCancelTransaction();
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack>
          <Text weight={700}>{t("This action is not recommended") as any}</Text>
          <Button
            color="red"
            onClick={() => {
              cancelTransaction({ transactionId });
            }}
            fullWidth
          >
            {t("Cancel") as any}
          </Button>
        </Stack>
      </Modal>
      <Button variant="light" color="red" onClick={() => setOpened(true)}>
        {t("Cancal") as any}
      </Button>
    </>
  );
};

export default CancelTransactionModal;
