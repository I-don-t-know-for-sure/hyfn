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
import { t } from "utils/i18nextFix";
import React, { useState } from "react";

interface AddDriverModalProps {
  driver: any;
  removeDriver: any;
  updateDriverBalance: any;
}

const DriverModal: React.FC<AddDriverModalProps> = ({
  driver,
  removeDriver,
  updateDriverBalance,
}) => {
  const [opened, setOpened] = useState(false);
  const [balanceToAdd, setBalanceToAdd] = useState(driver.balance);
  const [managementCut, setManagementCut] = useState(driver.managementCut);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack>
          <Group>
            <Box>
              <Text weight={700}>ID</Text>
              <Text>{driver._id}</Text>
            </Box>
          </Group>
          <Group position="apart">
            <TextInput
              readOnly
              value={driver.driverName}
              label={t("Full name")}
              variant="unstyled"
            />
            <TextInput
              readOnly
              value={driver.driverPhone}
              label={t("Driver phone")}
              variant="unstyled"
            />
          </Group>

          <Group grow>
            <NumberInput
              value={balanceToAdd}
              onChange={(e) => {
                setBalanceToAdd(e);
              }}
              label={t("Balance to add to the driver")}
            />
            {/* <NumberInput
              min={0}
              max={MAXIMUM_MANAGEMENT_CUT}
              precision={2}
              step={0.05}
              withAsterisk={false}
              value={managementCut}
              onChange={(e) => {
                setManagementCut(e);
              }}
              label={t("Cut to take from the driver")}
              rightSection={
                <Center mr={40}>
                  <ActionIcon
                    sx={(theme) => ({
                      width: "60px",
                      color: theme.primaryColor,
                    })}
                    onClick={() => {
                      setManagementCut(1);
                    }}
                  >
                    <Text>{t("100%")}</Text>
                  </ActionIcon>
                </Center>
              }
            /> */}
          </Group>
          <Button
            onClick={() =>
              updateDriverBalance({
                driverId: driver._id,
                newBalance: balanceToAdd,
                newCut: managementCut,
              })
            }
          >
            {t("Update balance")}
          </Button>

          <Group grow mt={16}>
            <Button
              onClick={() => removeDriver({ driverId: driver._id })}
              color={"red"}
            >
              {t("Remove driver")}
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button
        onClick={() => {
          setOpened(true);
        }}
      >
        {t("Driver Info")}
      </Button>
    </>
  );
};

export default DriverModal;
