import React, { useState } from "react";
import { useGetOrders } from "./hooks/useGetOrders";
import {
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useGetAllDrivers } from "./hooks/useGetAllDrivers";
import { t } from "utils/i18nextFix";

import ReplaceDriverModal from "./components/ReplaceDriverModal";
import StoreDetailsModal from "./components/StoreDetailsModal";

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
    <Container>
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
                  (status) => status.userType === "driver"
                ).id;
                const driver = data.find((driver) => driver.value === driverId);

                return (
                  <Card
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Stack>
                      <Group position="apart">
                        <TextInput
                          label={t("Order Id")}
                          value={order.id}
                          variant="unstyled"
                        />
                        <TextInput
                          variant="unstyled"
                          label={t("Store")}
                          value={order?.orders[0]?.storeName}
                          rightSection={
                            <StoreDetailsModal storeDetails={order.orders[0]} />
                          }
                        />
                      </Group>

                      <Stack>
                        <TextInput label={t("Driver")} value={driver.label} />
                        <ReplaceDriverModal
                          allDrivers={data}
                          oldDriver={driver}
                          orderId={order.id}
                        />
                      </Stack>
                    </Stack>
                  </Card>
                );
              });
            })
          )}
        </Center>
      </Stack>
    </Container>
  );
};

export default Orders;
