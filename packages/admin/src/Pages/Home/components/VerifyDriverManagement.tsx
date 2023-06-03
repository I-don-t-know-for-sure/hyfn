import { Box, Button, Group, Modal, Stack, TextInput } from "hyfn-client";
import { t } from "utils/i18nextFix";
import React, { useState } from "react";
import { useGetDriverManagement } from "../hooks/useGetDriverManagement";
import { useVerifyDriverManagement } from "../hooks/useVerifyDriverManagement";

interface TrustDriverManagementProps {}

const VerifyDriverManagement: React.FC<TrustDriverManagementProps> = ({}) => {
  const [opened, setOpened] = useState(false);
  const [driverManagement, setDriverManagement] = useState("");
  const { isLoading, data, refetch } = useGetDriverManagement({
    driverManagement,
  });
  const { mutate } = useVerifyDriverManagement();
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
      >
        <Group>
          <TextInput
            placeholder={t("Management Id")}
            value={driverManagement}
            onChange={(e) => setDriverManagement(e.target.value)}
          />
          <Button
            sx={{
              // minWidth: "60px",
              maxWidth: "60px",
            }}
            onClick={() => {
              refetch();
            }}
          >
            {t("Get")}
          </Button>
        </Group>

        {!isLoading && data && (
          <Box>
            <Stack>
              <TextInput
                type="text"
                label={t("Management name")}
                readOnly
                value={data.managementName}
              />

              <TextInput
                type="number"
                label={t("Phone number")}
                readOnly
                value={data.managementPhone}
              />

              <TextInput
                type="text"
                label={t("Management address")}
                readOnly
                value={data.managementAddress}
              />

              <Button
                fullWidth
                onClick={() => {
                  mutate({ driverManagement });
                }}
              >
                {t("Verify")}
              </Button>
            </Stack>
          </Box>
        )}
      </Modal>
      <Button onClick={() => setOpened(true)}>
        {t("Verify driver management")}
      </Button>
    </>
  );
};

export default VerifyDriverManagement;
