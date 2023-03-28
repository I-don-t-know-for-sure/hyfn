import { Badge, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { t } from "i18next";
import React, { useState } from "react";
import { useSetDeliveryFeePaid } from "../hooks/useSetDeliveryFeePaid";

interface DeliveryFeePaidModalProps {
  deliveryFeePaid: boolean;
}

const DeliveryFeePaidModal: React.FC<DeliveryFeePaidModalProps> = ({
  deliveryFeePaid,
}) => {
  const [opened, setOpened] = useState(false);
  const { mutate: setDeliveryFeePaid } = useSetDeliveryFeePaid();

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack>
          <Text weight={700}>{t("Use this if you are paid in cash only")}</Text>
          <Button
            onClick={() => {
              setDeliveryFeePaid();
            }}
          >
            {t("Set to paid")}
          </Button>
        </Stack>
      </Modal>
      <Group>
        <Text weight={700}>{t("Delivery Fee")}</Text> :
        <Badge
          sx={{
            cursor: "pointer",
          }}
          color={deliveryFeePaid ? "green" : "red"}
          onClick={() => {
            setOpened(!deliveryFeePaid);
          }}
        >
          {deliveryFeePaid ? t("Paid") : t("Set Paid")}
        </Badge>
      </Group>
    </>
  );
};

export default DeliveryFeePaidModal;
