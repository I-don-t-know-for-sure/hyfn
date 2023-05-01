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
import { ImageModal } from "hyfn-client";
import DeliveredModal from "components/DeliveredModal";
import PayModal from "components/PayModal";

import { t } from "utils/i18nextFix";

import React, { useEffect, useState } from "react";

import { calculateDuration } from "utils/calculateDuration";

import ControlButton from "./components/ControlButton";
import OptionsModal from "./components/OptionsModal";
import TransactionModal from "./components/TransactionModal";
import { useGetActiveOrder } from "./hooks/useGetActiveOrder";
import { usePayStore } from "./hooks/usePayStore";
import { useSetOrderAsDelivered } from "./hooks/useSetOrderAsDelivered";
import { useSetProductAsNotFound } from "./hooks/useSetProductAsNotFound";
import { useSetProductAsPickedUp } from "./hooks/useSetProductAsPickedUp";
import { useValidateStoreLocalCardTransaction } from "./hooks/useValidateStoreLocalCardTransaction";
import { useLeaveOrder } from "./hooks/useLeaveOrder";
import OrderActionMenu from "./components/OrderActionMenu";
import { useRefreshOrderDocument } from "./hooks/useRefreshOrderDocument";
import TextToCopy from "./components/TextToCopy";
import InstructionsModal from "./components/InstructionsModak";
import CopyButton from "components/CopyButton";
import { STORE_STATUS_PENDING, STORE_TYPE_RESTAURANT } from "hyfn-types";
import RestuarantOrder from "./components/RestuarantOrder";

interface ActiveOrderProps {}

const ActiveOrder: React.FC<ActiveOrderProps> = () => {
  const {
    data: order = {},
    isLoading,
    isError,
    error,
    isFetched,
    isSuccess,
    refetch,
  } = useGetActiveOrder();
  console.log("🚀 ~ file: ActiveOrder.tsx:45 ~ order", order);

  const { mutate: setProductAsPickedUp } = useSetProductAsPickedUp();
  const { mutate: setProductAsNotFound } = useSetProductAsNotFound();
  const { mutate: payStore } = usePayStore();
  const { mutate: validateStoreLocalCardTransaction } =
    useValidateStoreLocalCardTransaction();
  const { mutate: setOrderAsDelivered } = useSetOrderAsDelivered();
  const { mutate: leaveOrder } = useLeaveOrder();
  const orderId =
    typeof order === "object"
      ? Object.hasOwn(order, "_id")
        ? order?._id.toString()
        : ""
      : "";
  // const { refetch, isLoading: isRefreshOrderLoading } = useRefreshOrderDocument({
  //   orderId,
  // })

  // const clipboard = useClipboard({ timeout: 1500 })
  const [restuarant, setRestuarant] = useState(false);
  useEffect(() => {
    if (Array.isArray(order.orders)) {
      setRestuarant(order.orders[0].storeType.includes(STORE_TYPE_RESTAURANT));
    }
  }, [order, isLoading]);
  console.log(isLoading, isFetched);
  if (isFetched) {
    console.log(orderId);
  }
  const driver = order?.status?.find((status) => status.userType === "driver");
  // console.log(order.duration)
  return (
    <Container mt={6}>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{error as any}</Text>
      ) : (
        typeof order !== "string" &&
        (true ? (
          <RestuarantOrder />
        ) : (
          <Card m={"24px auto"}>
            <LoadingOverlay
              visible={isLoading}
              sx={{
                width: "100%",
                height: "100%",
              }}
            />
            <Stack>
              <Group position="right">
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
                    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
                  </svg>
                </ActionIcon>
                <OrderActionMenu
                  orderType={order.orderType}
                  isOrderTakenByDriver={driver?._id !== ""}
                  orderId={orderId}
                />
              </Group>
              <Group>
                <CopyButton value={orderId} />
                {/* <Button
                onClick={() => {
                  leaveOrder({ orderId: order._id.toString() })
                }}
                >
                {t('Leave Order')}
              </Button> */}
              </Group>
            </Stack>
            <Group>
              <Group m={"md"}>
                <Text>
                  {t("Duration")} : {calculateDuration(order.duration)}
                </Text>
                <Text>
                  {t("Distance")} : {(order?.distance / 1000).toFixed(1)} KM
                </Text>
              </Group>
            </Group>

            {order?.orders?.map((store) => {
              return (
                <Box
                  key={store._id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Accordion
                    variant="contained"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Accordion.Item
                      value={store._id}
                      key={store._id}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <Accordion.Control
                        sx={{
                          overflowX: "scroll",
                        }}
                      >
                        {" "}
                        <Box
                          sx={(theme) => ({
                            overflowX: "scroll",
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            [theme.fn.smallerThan("md")]: {
                              flexDirection: "column",
                              justifyContent: "space-around",
                              alignContent: "center",
                            },
                          })}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={(theme) => ({
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                [theme.fn.smallerThan("md")]: {
                                  flexDirection: "column",
                                  justifyContent: "space-around",
                                  alignContent: "center",
                                },
                              })}
                            >
                              <Text
                                variant="text"
                                weight={600}
                                sx={{
                                  fontSize: "24px",
                                  margin: "4px auto",
                                }}
                              >
                                {store.storeName}
                              </Text>
                            </Box>
                            <PayModal
                              pay={() => {
                                payStore(store._id);
                              }}
                              storeProducts={store.addedProducts}
                            />
                            <Space w={10} />
                            {Array.isArray(store.transactions) && (
                              <TransactionModal
                                validateTransaction={
                                  validateStoreLocalCardTransaction
                                }
                                transactions={store.transactions}
                              />
                            )}
                          </Box>
                          <CopyButton
                            value={`${order.buyerCoords[1]},${order.buyerCoords[0]}`}
                          />
                        </Box>
                      </Accordion.Control>
                      <Accordion.Panel
                        sx={{
                          overflowX: "scroll",
                        }}
                      >
                        <Table>
                          <thead>
                            <tr>
                              <th
                                style={{
                                  minWidth: "80px",
                                }}
                              >
                                {t("Name")}
                              </th>
                              <th
                                style={{
                                  minWidth: "50px",
                                }}
                              >
                                {t("QTY")}
                              </th>
                              <th
                                style={{
                                  minWidth: "90px",
                                }}
                              >
                                {t("Image")}
                              </th>
                              <th
                                style={{
                                  minWidth: "90px",
                                }}
                              >
                                {t("Options")}
                              </th>
                              <th
                                style={{
                                  minWidth: "110px",
                                }}
                              >
                                {t("Instructions")}
                              </th>
                              <th
                                style={{
                                  margin: "0px auto",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {t("Control")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {store.addedProducts.map((product, index) => {
                              console.log(product);
                              const pickUp = (pickupCount) => {
                                console.log({
                                  storeId: store._id,
                                  productKey: product.key,
                                  QTYFound: pickupCount,
                                });

                                setProductAsPickedUp({
                                  storeId: store._id,
                                  productKey: product.key,
                                  QTYFound: pickupCount,
                                });
                              };

                              const notFound = () => {
                                setProductAsNotFound({
                                  storeId: store._id,
                                  productKey: product.key,
                                });
                              };
                              return (
                                <tr
                                  key={`${product._id}${index}`}
                                  style={{
                                    boxShadow:
                                      "box-shadow: -2px -2px 16px 11px rgba(0,0,0,0.75)",
                                  }}
                                >
                                  <td>
                                    <Text>{product.textInfo.title}</Text>
                                    {/* {product.options?.length > 0 && (
                                      <Container>
                                      {product.options.map((option) => {
                                        return (
                                          <Box
                                          sx={{
                                            display: 'flex',
                                          }}
                                          >
                                          <Text>{option.optionName}:</Text>
                                          {option.optionValues.map((value) => {
                                            return (
                                              <Badge m={'0px 6px'} size="md">
                                              {value}
                                              </Badge>
                                              )
                                            })}
                                            </Box>
                                            )
                                          })}
                                          </Container>
                                        )} */}
                                  </td>
                                  <td>{product.qty}</td>
                                  <td>
                                    {/* <Image
                                      radius={4}
                                      sx={{
                                        maxWidth: '45px',
                                        maxHeight: '45px',
                                      }}
                                      src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${product.images[0]}`}
                                    /> */}
                                    <ImageModal
                                      radius={4}
                                      sx={{
                                        maxWidth: "45px",
                                        maxHeight: "45px",
                                      }}
                                      src={`${
                                        import.meta.env.VITE_APP_BUCKET_URL
                                      }/tablet/${product.images[0]}`}
                                    />
                                  </td>
                                  <td>
                                    {product.options.length > 0 ? (
                                      <OptionsModal options={product.options} />
                                    ) : (
                                      <Text weight={700}>
                                        {t("No options")}
                                      </Text>
                                    )}
                                  </td>
                                  <td>
                                    {product.instructions ? (
                                      <InstructionsModal
                                        instructions={product.instructions}
                                      />
                                    ) : (
                                      <Text weight={700}>
                                        {t("No instructions")}
                                      </Text>
                                    )}
                                  </td>
                                  <td>
                                    <ControlButton
                                      pickUp={pickUp}
                                      notFound={notFound}
                                      productQTY={product.qty}
                                      found={product?.pickup}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Box>
              );
            })}

            <Group grow mt={8}>
              <DeliveredModal delivered={setOrderAsDelivered} />
            </Group>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ActiveOrder;
