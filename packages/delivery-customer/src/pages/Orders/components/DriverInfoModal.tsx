import { Button, Group, Image, Modal, Stack } from "@mantine/core";
import React, { useState } from "react";
import { t } from "util/i18nextFix";

import { useGetDriverInfo } from "../hooks/useGetDriverInfo";

interface DriverInfoModalProps {
  driverId: string;
}

const DriverInfoModal: React.FC<DriverInfoModalProps> = ({ driverId }) => {
  const [opened, setOpened] = useState(false);
  const { data, isLoading, isFetched } = useGetDriverInfo({ driverId, opened });
  console.log("🚀 ~ file: DriverInfoModal.tsx:16 ~ data", data);

  console.log("🚀 ~ file: DriverInfoModal.tsx:17 ~ data", data);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack>
          <Group grow>
            {/* <Image
              src={`${
                import.meta.env.VITE_APP_BUCKET_URL
              }/driver-verification/${data?.passportPic}`}
              alt={t("Passport pic")}
            /> */}
            {/* <Image
              src={`${
                import.meta.env.VITE_APP_BUCKET_URL
              }/driver-verification/${data?.passportAndFacePic}`}
            /> */}
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

export default DriverInfoModal;
