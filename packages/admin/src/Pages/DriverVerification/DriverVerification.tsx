import React from "react";
import { useGetUnverifiedDrivers } from "./hooks/useGetUnverifiedDrivers";
import {
  Button,
  Card,
  Container,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { t } from "utils/i18nextFix";
import { DRIVER_VERIFICATION } from "hyfn-types";
import { useSetDriverAsVerified } from "./hooks/useSetDriverAsVerified";

interface DriverVerificationProps {}

const DriverVerification: React.FC<DriverVerificationProps> = ({}) => {
  const {
    data: unverifiedDriversPages,
    isLoading,
    isError,
    fetchNextPage,
  } = useGetUnverifiedDrivers();
  const { mutate: setDriverAsVerified } = useSetDriverAsVerified();
  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{"Error"}</Text>
      ) : (
        unverifiedDriversPages.pages.map((page) => {
          return page.map((unverifiedDriver) => {
            return (
              <Card>
                <Stack spacing={"sm"}>
                  <Group grow>
                    <Image
                      src={`${
                        import.meta.env.VITE_APP_BUCKET_URL
                      }/${DRIVER_VERIFICATION}/${
                        unverifiedDriver.passportPic[0]
                      }`}
                    />
                    <Image
                      src={`${
                        import.meta.env.VITE_APP_BUCKET_URL
                      }/${DRIVER_VERIFICATION}/${
                        unverifiedDriver.passportPic[0]
                      }`}
                    />
                  </Group>
                  <TextInput
                    readOnly
                    label={t("Full name")}
                    value={unverifiedDriver?.driverName}
                  />
                  <TextInput
                    readOnly
                    label={t("Phone number")}
                    value={unverifiedDriver?.driverPhone}
                  />
                  <TextInput
                    readOnly
                    label={t("Passport number")}
                    value={unverifiedDriver?.passportNumber}
                  />
                  <Button
                    onClick={() => {
                      setDriverAsVerified({
                        driverId: unverifiedDriver._id.toString(),
                      });
                    }}
                  >
                    {t("Set driver as verified")}
                  </Button>
                </Stack>
              </Card>
            );
          });
        })
      )}
      <Button
        onClick={() => {
          fetchNextPage({
            pageParam:
              unverifiedDriversPages?.pages[
                unverifiedDriversPages?.pages?.length - 1
              ][
                unverifiedDriversPages?.pages[
                  unverifiedDriversPages?.pages?.length - 1
                ].length
              ],
          });
        }}
      >
        {t("Load more")}
      </Button>
    </Container>
  );
};

export default DriverVerification;
