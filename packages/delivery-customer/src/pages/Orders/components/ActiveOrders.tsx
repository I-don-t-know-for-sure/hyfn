import { Button, Center, Container, Loader, Text } from "@mantine/core";

import { usePagination } from "hooks/usePagination";

import { t } from "../../../util/i18nextFix";
import React from "react";
import { useValidateStoreLocalCardTransaction } from "../hooks/payStoreWithLocalCard/useValidateStoreLocalCardTransaction";
import { useCancelStore } from "../hooks/useCancelStore";
import { useGetActiveOrders } from "../hooks/useGetActiveOrders";
import { useSetOrderToPickup } from "../hooks/useSetOrderToPickUp";

import DeliveryActiveOrder from "./DeliveryActiveOrder";

import PickupActiveOrder from "./PickupActiveOrder";
import { useSetProductAsPickedUp } from "../hooks/useSetProductAsPickedUp";
import { useSetProductAsNotFound } from "../hooks/useSetProductAsNotFound";
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
  const { mutate: validateTransaction } =
    useValidateStoreLocalCardTransaction();
  const { mutate: setOrderToPickup } = useSetOrderToPickup();
  const { mutate: cancelOrder } = useCancelStore();
  const { mutate: setProductAsPickedUp } = useSetProductAsPickedUp();
  const { mutate: setProductAsNotFound } = useSetProductAsNotFound();
  const { userDocument } = useUser();

  // usePagination(fetchNextPage, orders);
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
            // return order.orderType === ORDER_TYPE_DELIVERY ? (
            return (
              <DeliveryActiveOrder
                serviceFeePaid={serviceFeePaid}
                index={index}
                order={order}
                driver={driver}
                validateTransaction={validateTransaction}
                cancelOrder={cancelOrder}
                balance={userDocument.balance}
                serviceFee={order.serviceFee}
              />
            );
            // ) : (
            //   <PickupActiveOrder
            //     index={index}
            //     order={order}
            //     payStore={() => {}}
            //     validateStoreLocalCardTransaction={validateTransaction}
            //     setOrderAsDelivered={() => {}}
            //     setProductAsNotFound={setProductAsNotFound}
            //     setProductAsPickedUp={setProductAsPickedUp}
            //     clipboard={{}}
            //   />
            // );
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
                ]?._id,
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
