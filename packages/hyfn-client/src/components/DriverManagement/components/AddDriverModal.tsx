import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { t } from "i18next";
import React, { useState } from "react";

interface AddDriverModalProps {
  driver: any;
  addDriver: any;
}

const AddDriverModal: React.FC<AddDriverModalProps> = ({
  driver,
  addDriver,
}) => {
  const [opened, setOpened] = useState(false);
  const [balanceToAdd, setBalanceToAdd] = useState(0);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Box>
          <Text weight={700}>ID</Text>
          <Text>{driver.id}</Text>
        </Box>
        <Group
          position="apart"
          grow
          sx={{
            maxWidth: "300px",
            margin: "24px auto",
          }}
        >
          <TextInput
            label={t("Full name") as any}
            value={driver.driverName}
            readOnly
            variant="unstyled"
          />
          <TextInput
            label={t("Driver phone") as any}
            value={driver.driverPhone}
            readOnly
            variant="unstyled"
          />
        </Group>

        <Stack>
          <NumberInput
            value={balanceToAdd}
            onChange={(e) => setBalanceToAdd(e as any)}
            label={t("Balance to add to the driver") as any}
          />
          <Button
            onClick={() =>
              addDriver({ driverId: driver.id, balance: balanceToAdd })
            }
          >
            {t("Add driver") as any}
          </Button>
        </Stack>
      </Modal>
      <Button
        onClick={() => {
          setOpened(true);
        }}
      >
        {t("Add driver") as any}
      </Button>
    </>
  );
};

export default AddDriverModal;
