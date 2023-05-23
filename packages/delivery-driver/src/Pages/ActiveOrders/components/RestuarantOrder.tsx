import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Space,
  Stack,
  Table,
  Text,
} from "@mantine/core";

import DeliveredModal from "components/DeliveredModal";
import PayModal from "components/PayModal";

import { t } from "utils/i18nextFix";

import React from "react";

import { calculateDuration } from "utils/calculateDuration";

import OptionsModal from "./OptionsModal";
import TransactionModal from "./TransactionModal";
import { useGetActiveOrders } from "../hooks/useGetActiveOrders";
import { usePayStore } from "../hooks/usePayStore";
import { useSetOrderAsDelivered } from "../hooks/useSetOrderAsDelivered";
import { useSetProductAsNotFound } from "../hooks/useSetProductAsNotFound";
import { useSetProductAsPickedUp } from "../hooks/useSetProductAsPickedUp";
import { useValidateStoreLocalCardTransaction } from "../hooks/useValidateStoreLocalCardTransaction";
import { useLeaveOrder } from "../hooks/useLeaveOrder";
import OrderActionMenu from "./OrderActionMenu";

import CopyButton from "components/CopyButton";
import { STORE_STATUS_PENDING, STORE_TYPE_RESTAURANT } from "hyfn-types";
import DeliveryFeePaidModal from "./DeliveryFeePaidModal";
import { ShowInMapButton } from "hyfn-client";
import { Link } from "react-router-dom";
import PickupOrderModal from "components/PickupOrderModal";
import { ORDER_STATUS_PICKED } from "hyfn-types";

interface ActiveOrderProps {}

const RestuarantOrder: React.FC<ActiveOrderProps> = () => {
  const {
    data: order,
    isLoading,
    isError,
    error,
    isFetched,
    isSuccess,
    refetch,
  } = useGetActiveOrders();
  console.log("🚀 ~ file: ActiveOrder.tsx:45 ~ order", order);

  const { mutate: setProductAsPickedUp } = useSetProductAsPickedUp();
  const { mutate: setProductAsNotFound } = useSetProductAsNotFound();
  const { mutate: payStore } = usePayStore();
  const { mutate: validateStoreLocalCardTransaction } =
    useValidateStoreLocalCardTransaction();
  const { mutate: setOrderAsDelivered } = useSetOrderAsDelivered();
  const { mutate: leaveOrder } = useLeaveOrder();
  // const orderId =
  //   typeof order === "object"
  //     ? Object.hasOwn(order, "id")
  //       ? order?.id
  //       : ""
  //     : "";
  // const { refetch, isLoading: isRefreshOrderLoading } = useRefreshOrderDocument({
  //   orderId,
  // })

  // const clipboard = useClipboard({ timeout: 1500 })

  // console.log(isLoading, isFetched);
  // if (isFetched) {
  //   console.log(orderId);
  // }
  // const driver = order?.status?.find((status) => status.userType === "driver");
  // console.log(order.duration)

  return (
    <Container mt={6}>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{error}</Text>
      ) : (
        order?.pages?.length > 0 &&
        order?.pages.map((page) => {
          if (!Array.isArray(page)) {
            return;
          }
          page?.map((order) => {
            const orderId = order.id;

            return (
              <Card m={"24px auto"}>
                <LoadingOverlay
                  visible={isLoading}
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                />
                <Stack>
                  <Group
                    position="apart"
                    sx={{
                      display: "flex",
                      flexDirection: "row-reverse",
                    }}
                  >
                    <Group>
                      <ActionIcon
                        onClick={() => {
                          refetch();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-refresh"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
                          <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
                        </svg>
                      </ActionIcon>
                      <OrderActionMenu
                        orderType={order.orderType}
                        isOrderTakenByDriver={true}
                        orderId={orderId}
                      />
                    </Group>
                    <Box>
                      <Group>
                        <Text weight={700}>{t("Order Status")}</Text> :
                        <Badge
                          color={
                            order?.orders[0]?.orderStatus ===
                            STORE_STATUS_PENDING
                              ? "red"
                              : "green"
                          }
                        >
                          {order?.orders[0]?.orderStatus}
                        </Badge>
                      </Group>

                      <DeliveryFeePaidModal
                        deliveryFeePaid={order.deliveryFeePaid}
                      />
                    </Box>
                  </Group>

                  <Group>
                    <CopyButton value={orderId} />
                    {/* <Button
                  onClick={() => {
                    leaveOrder({ orderId: order.id })
                  }}
                  >
                  {t('Leave Order')}
                </Button> */}
                  </Group>
                </Stack>
                <Group>
                  {/* <Group m={"md"}>
                <Text>
                {t("Duration")} : {calculateDuration(order.duration)}
                </Text>
                <Text>
                {t("Distance")} : {(order?.distance / 1000).toFixed(1)} KM
                </Text>
              </Group> */}
                </Group>

                {order?.orders?.map((store) => {
                  return (
                    <Box
                      key={store.id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Group position="apart">
                        <Text
                          variant="text"
                          weight={600}
                          sx={{
                            fontSize: "24px",
                            margin: "4px auto",
                          }}
                        >
                          {store.storeName || store.businessName}
                        </Text>

                        <Space w={10} />
                        {/* {Array.isArray(store.transactions) && (
                      <TransactionModal
                      validateTransaction={validateStoreLocalCardTransaction}
                      transactions={store.transactions}
                      />
                    )} */}
                        {/* <CopyButton
                      value={`${order.buyerCoords[1]},${order.buyerCoords[0]}`}
                    /> */}
                        <ShowInMapButton
                          component={Link}
                          coords={`${order.buyerCoords[1]},${order.buyerCoords[0]}`}
                          label={t("Map")}
                        />
                        <PickupOrderModal
                          orderId={order.id}
                          pickedUp={store.orderStatus === ORDER_STATUS_PICKED}
                        />
                      </Group>
                      <Table>
                        <thead>
                          <tr>
                            {/* <th
                            style={{
                              margin: '0px auto',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            >
                            <Text sx={{}}>{t('Index')}</Text>
                          </th> */}
                            <th>{t("Name")}</th>
                            <th>{t("Quantity")}</th>
                            <th>{t("Image")}</th>
                            <th>{t("Options")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {store.addedProducts.map((product, index) => {
                            console.log(product);

                            return (
                              <tr key={index}>
                                {/* <td>{index + 1}</td> */}
                                <td>
                                  <Text>{product.textInfo.title}</Text>
                                </td>
                                <td>{product.qty}</td>
                                <td>
                                  <Image
                                    radius={4}
                                    sx={{
                                      width: "45px",
                                      height: "45px",
                                      maxWidth: "45px",
                                      maxHeight: "45px",
                                    }}
                                    src={`${
                                      import.meta.env.VITE_APP_BUCKET_URL
                                    }/tablet/${product.images[0]}`}
                                  />
                                </td>
                                <td>
                                  {product.options.hasOptions ? (
                                    <OptionsModal
                                      options={product.options.options}
                                    />
                                  ) : (
                                    <Text weight={700}>{t("No options")}</Text>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Box>
                  );
                })}

                <Group grow mt={8}>
                  <DeliveredModal delivered={setOrderAsDelivered} />
                </Group>
              </Card>
            );
          });
        })
      )}
    </Container>
  );
};

export default RestuarantOrder;
