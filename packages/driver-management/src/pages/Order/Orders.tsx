import React, { useState } from "react";
import { useGetOrders } from "./hooks/useGetOrders";
import {
  Button,
  Card,
  Center,
  Checkbox,
  Group,
  Loader,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useGetAllDrivers } from "./hooks/useGetAllDrivers";
import { t } from "i18next";
import { USER_TYPE_DRIVER } from "hyfn-types";
import ReplaceDriverModal from "./components/ReplaceDriverModal";

interface OrdersProps {}

const Orders: React.FC<OrdersProps> = ({}) => {
  const [active, setActive] = useState(true);
  const [type, setType] = useState("all");
  const { data, isLoading } = useGetAllDrivers();
  const { data: orders, isLoading: ordersLoading } = useGetOrders({
    active,
    type,
  });
  return (
    <Stack mt={6}>
      <Center>
        <Group>
          <Select
            label={t("Driver")}
            onChange={(value) => setType(value)}
            value={type}
            searchable
            {...(isLoading
              ? { data: [] }
              : { data: [...data, { label: "all", value: "all" }] })}
          />
          <Checkbox
            label={t("Active")}
            onChange={() => setActive(!active)}
            checked={active}
          />
        </Group>
      </Center>
      <Center>
        {ordersLoading ? (
          <Loader />
        ) : (
          orders.pages.map((page) => {
            return page.map((order) => {
              const driverId = order.status.find(
                (status) => status.userType === USER_TYPE_DRIVER
              )._id;
              const driver = data.find((driver) => driver.value === driverId);

              return (
                <Card>
                  <TextInput label={t("Driver")} value={driver.label} />
                  <ReplaceDriverModal
                    allDrivers={data}
                    oldDriver={driver}
                    orderId={order._id}
                  />
                </Card>
              );
            });
          })
        )}
      </Center>
    </Stack>
  );
};

export default Orders;
