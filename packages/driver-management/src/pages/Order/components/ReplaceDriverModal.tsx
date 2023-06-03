import { Button, Modal, Select, Stack } from "hyfn-client";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";
import { useReplaceDriver } from "../hooks/useReplaceDriver";

interface ReplaceDriverModalProps {
  allDrivers: any[];
  oldDriver: any;
  orderId: string;
}

const ReplaceDriverModal: React.FC<ReplaceDriverModalProps> = ({
  allDrivers,
  oldDriver,
  orderId,
}) => {
  const [opened, setOpened] = useState(false);
  const [newDriver, setNewDriver] = useState<null | string>(null);
  const { mutate } = useReplaceDriver();
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack>
          <Select
            label={t("Replace with")}
            data={allDrivers}
            value={newDriver}
            onChange={setNewDriver}
          />
          <Button
            onClick={() => {
              mutate({
                driverId: oldDriver.value,
                newDriverId: newDriver,
                orderId,
              });
            }}
          >
            {t("Replace")}
          </Button>
        </Stack>
      </Modal>
      <Button onClick={() => setOpened(true)}>{t("Replace Driver")}</Button>
    </>
  );
};

export default ReplaceDriverModal;
