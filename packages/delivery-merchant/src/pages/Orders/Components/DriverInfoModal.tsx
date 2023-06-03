import { Button, Group, Image, Modal, Stack, TextInput } from "hyfn-client";
import React, { useState } from "react";
import { t } from "utils/i18nextFix";

import { useGetDriverInfo } from "../hooks/useGetDriverInfo";

interface DriverInfoModalProps {
  storeId: string;
  orderId: string;
  driverId: string;
  balancedByDriver: boolean;
}

const DriverInfoModal: React.FC<DriverInfoModalProps> = ({
  storeId,
  orderId,
  driverId,
  balancedByDriver,
}) => {
  const [opened, setOpened] = useState(false);
  const { data, isLoading, isFetched } = useGetDriverInfo({ driverId, opened });
  console.log("🚀 ~ file: DriverInfoModal.tsx:16 ~ data", data);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack>
          <Group grow>
            <Image
              src={`${
                import.meta.env.VITE_APP_BUCKET_URL
              }/driver-verification/${data?.passportPic}`}
              alt={t("Passport pic")}
            />
            <Image
              src={`${
                import.meta.env.VITE_APP_BUCKET_URL
              }/driver-verification/${data?.passportAndFacePic}`}
            />
          </Group>
          <Group grow>
            <TextInput
              label={t("Driver name")}
              value={data?.driverName}
              readOnly
            />
            <TextInput
              label={t("Driver phone")}
              value={data?.driverPhone}
              readOnly
            />
          </Group>
          {/* {!driverCheckedBy8Stores && !balancedByDriver && (
            <Group grow>
              <Button
                onClick={() => {
                  verifyDriver({ orderId, storeId })
                }}
              >
                {t('Verify driver')}
              </Button>
              <Button
                onClick={() => {
                  setDriverAsNotVerified({ orderId, storeId })
                }}
              >
                {t('Set driver as not verified')}
              </Button>
            </Group>
          )} */}
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
