import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Image,
  Loader,
  Table,
  Text,
} from "@mantine/core";

import OrderCard from "../../../pages/Orders/components/OrderCard";

import { t } from "../../../util/i18nextFix";
import React from "react";
import { useGetOrderHistory } from "../hooks/useGetOrderHistory";

interface OrderHistoryProps {}

const OrderHistory: React.FC<OrderHistoryProps> = ({}) => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
    fetchNextPage,
  } = useGetOrderHistory();
  console.log("🚀 ~ file: OrderHistory.tsx:13 ~ orders", orders);

  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : orders?.pages.flatMap((order) => order).length === 0 ? (
        <Box sx={{ width: "100%" }}>
          <Text m={"4px auto"}>{t("No previous orders yet")}</Text>
        </Box>
      ) : (
        orders?.pages.map((page) => {
          return page.map((order) => {
            return <OrderCard order={order} key={order?.id?.toString()} />;
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

export default OrderHistory;
