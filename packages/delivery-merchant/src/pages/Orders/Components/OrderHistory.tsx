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
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useUser } from "contexts/userContext/User";

import useUpdateProductState from "hooks/useUpdateProductState";
import { t } from "utils/i18nextFix";
import React, { useEffect } from "react";
// import { Helmet } from 'react-helmet-async'

import { useGetOrderHistory } from "../hooks/useGetOrderHistory";
import { STORE_TYPE_RESTAURANT, storeServiceFee } from "hyfn-types";
import OptionsModal from "./OptionsModal";
import SetProductAsInactiveButton from "./setProductAsInactive";

interface OrderHistoryProps {}

const OrderHistory: React.FC<OrderHistoryProps> = ({}) => {
  const {
    data: orders,
    fetchNextPage,
    isLoading,
    error,
    isError,
  } = useGetOrderHistory();
  const { mutate: updateProductState } = useUpdateProductState();
  const { userId, userDocument } = useUser();

  // const [scroll] = useWindowScroll()
  // useEffect(() => {
  //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight && Array.isArray(orders?.pages)) {
  //     fetchNextPage({
  //       pageParam: orders?.pages[orders?.pages?.length - 1][orders?.pages[orders?.pages?.length - 1]?.length]?._id,
  //     })
  //   }
  // }, [scroll])
  const storeDoc = userDocument?.storeDoc as { id: string };
  const storeDocId = storeDoc?.id;

  return (
    <Container>
      {/* <Helmet>
        <title>{t(isLoading ? 'Loading' : 'Orders History')}</title>
      </Helmet> */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : orders?.pages?.flatMap((order) => order)?.length === 0 ? (
        <Box sx={{ width: "100%" }}>
          <Text m={"4px auto"}>{t("No previous orders yet")}</Text>
        </Box>
      ) : (
        orders?.pages?.map((page) => {
          return page?.map((order) => {
            const store = order.orders.find((store) => {
              return store._id === storeDocId;
            });
            const storeProducts = order.orders.find(
              (store) => store._id === storeDocId
            ).addedProducts;

            const orderTotal = storeProducts.reduce((accu, currentProduct) => {
              return (
                accu +
                currentProduct.pricing.price *
                  (store.storeType.includes(STORE_TYPE_RESTAURANT)
                    ? currentProduct.qty
                    : currentProduct?.pickup?.QTYFound)
              );
            }, 0);
            const orderSaleFee = parseFloat(
              (orderTotal * storeServiceFee).toFixed(2)
            );
            const orderTotalAfterFee = orderTotal - orderSaleFee;
            return (
              <Card mt={8}>
                <Text>{order._id.toString()}</Text>
                <Box
                  style={{
                    overflowX: "scroll",
                  }}
                >
                  <Table
                    style={{
                      overflowX: "scroll",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>{t("Name")}</th>
                        <th>{t("Quantity")}</th>
                        <th>{t("Image")}</th>
                        <th>{t("Options")}</th>

                        <th
                          style={{
                            margin: "0px auto",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text sx={{}}>{t("Control")}</Text>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orders
                        .find((store) => store._id === storeDocId)
                        .addedProducts.map((product, index) => {
                          return (
                            <tr>
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
                                {product.options.length > 0 ? (
                                  <OptionsModal options={product.options} />
                                ) : (
                                  <Text weight={700}>{t("No options")}</Text>
                                )}
                              </td>
                              <td>
                                <SetProductAsInactiveButton
                                  product={product}
                                  updateProductState={updateProductState}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </Box>
                <Stack m={"sm"}>
                  <Group position="apart">
                    <Text>{t("Order total")}</Text>
                    <Text>{`${
                      userDocument.currency || "LYD"
                    } ${orderTotal}`}</Text>
                  </Group>
                  <Group position="apart">
                    <Text>{t("Order sale fee")}</Text>
                    <Text>{`${
                      userDocument.currency || "LYD"
                    } ${orderSaleFee}`}</Text>
                  </Group>
                  <Group position="apart">
                    <Text>{t("Order Total after fee")}</Text>
                    <Text>{`${
                      userDocument.currency || "LYD"
                    } ${orderTotalAfterFee}`}</Text>
                  </Group>
                </Stack>
              </Card>
            );
          });
        })
      )}
      <Center>
        <Button
          m={"md"}
          fullWidth
          sx={{
            maxWidth: "450px",
          }}
          onClick={() => {
            fetchNextPage({
              pageParam:
                orders?.pages[orders?.pages?.length - 1][
                  orders?.pages[orders?.pages?.length - 1]?.length
                ]?._id,
            });
          }}
        >
          {t("Load more")}
        </Button>
      </Center>
    </Container>
  );
};

export default OrderHistory;
