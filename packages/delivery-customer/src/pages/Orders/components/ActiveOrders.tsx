import { Button, Center, Container, Loader, Text } from "@mantine/core";

import { t } from "../../../util/i18nextFix";
import React from "react";

import { useCancelStore } from "../hooks/useCancelStore";
import { useGetActiveOrders } from "../hooks/useGetActiveOrders";

import DeliveryActiveOrder from "./DeliveryActiveOrder";

import { useUser } from "../../../contexts/userContext/User";

interface ActiveOrdersProps {}

const ActiveOrders: React.FC<ActiveOrdersProps> = () => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
    fetchNextPage,
  } = useGetActiveOrders();
  console.log("🚀 ~ file: ActiveOrders.tsx:22 ~ orders", orders);

  const { mutate: cancelOrder } = useCancelStore();

  const { userDocument } = useUser();

  console.log(orders);
  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : (
        orders?.pages.map((page) => {
          return page?.map((order, index) => {
            const serviceFeePaid = order?.serviceFeePaid;
            const driver = { status: order.driverStatus, id: order.driverId };

            return (
              <DeliveryActiveOrder
                serviceFeePaid={serviceFeePaid}
                index={index}
                order={order}
                driver={driver}
                cancelOrder={cancelOrder}
                balance={userDocument.balance}
                serviceFee={order.serviceFee}
              />
            );
          });
        })
      )}
      <Center m={"12px auto"}>
        <Button
          sx={{
            width: "100%",
            maxWidth: "450px",
          }}
          onClick={() =>
            fetchNextPage({
              pageParam:
                orders?.pages[orders?.pages?.length - 1][
                  orders?.pages[orders.pages?.length - 1]?.length - 1
                ]?.id,
            })
          }
        >
          {t("Load more")}
        </Button>
      </Center>
    </Container>
  );
};

export default ActiveOrders;
