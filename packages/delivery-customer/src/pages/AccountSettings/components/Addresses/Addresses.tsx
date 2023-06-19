import {
  Box,
  Button,
  Card,
  Center,
  Group,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { useUser } from "../../../../contexts/userContext/User";
import { useGetUserDocument } from "../../../../hooks/useGetUserDocument";

import React, { useEffect, useState } from "react";
import { t } from "../../../../util/i18nextFix";
import Address from "./components/Address";
import { useManageAddresses } from "../../hooks/manageAddresses";
import { useLocation } from "contexts/locationContext/LocationContext";

interface ManageAddressesProps {}

const ManageAddresses: React.FC<ManageAddressesProps> = ({}) => {
  const { userId } = useUser();
  const { data, isLoading, isFetched } = useGetUserDocument({ userId });
  const [addresses, setAddresses] = useState([]);
  const [{ country, city }] = useLocation();
  const { mutate } = useManageAddresses();
  useEffect(() => {
    if (data && !isLoading && isFetched) {
      const { addresses: userAddresses } = data as { addresses: any[] };
      console.log(data);

      setAddresses(userAddresses || []);
    }
  }, [data, isLoading, isFetched]);

  return (
    <Card title="Addresses">
      <Group position={"left"}>
        <Text size={28}>{t("Addresses")}</Text>
      </Group>
      {/* <Box
        sx={{
          margin: "12px",
          justifyContent: "flex-end",
          display: "flex"
        }}></Box> */}
      {addresses?.map((address) => {
        return (
          <Address
            key={address.key}
            address={address}
            setAddresses={setAddresses}
          />
        );
      })}
      <Center
        sx={{
          margin: "auto",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column"
        }}>
        <Button
          sx={{
            width: "100%",
            marginBottom: "24px"
          }}
          onClick={() =>
            setAddresses([
              ...addresses,
              {
                country,
                city,
                label: "label",
                coords: "3.333,3.333",
                key: randomId(),
                locationDescription: "location Description"
              }
            ])
          }>
          {t("Add address")}
        </Button>
        {addresses?.length > 0 && (
          <Button
            sx={{
              width: "100%",
              marginBottom: "24px"
            }}
            onClick={() => mutate({ addresses })}>
            {t("Update")}
          </Button>
        )}
      </Center>
    </Card>
  );
};

export default ManageAddresses;
