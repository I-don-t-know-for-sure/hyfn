import {
  Box,
  Button,
  Center,
  Container,
  Loader,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { MENU_HEIGHT } from "components/Menu/config";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { t } from "utils/i18nextFix";
import { useGetActiveOrders } from "../hooks/useGetActiveOrders";
import { useValidateStoreLocalCardTransaction } from "../hooks/useValidateStoreLocalCardTransaction";
import useUpdateProductState from "hooks/useUpdateProductState";
import { useRejectOrder } from "../hooks/useRejectOrder";
import { useSetOrderAsPreparing } from "../hooks/useSetOrderAsPreparing";
import { useSetOrderAsReady } from "../hooks/useSetOrderAsReady";
import { useSetOrderAsDelivered } from "../hooks/useSetOrderAsDelivered";
import { useUser } from "contexts/userContext/User";
// import { Helmet } from "react-helmet-async";
import { USER_TYPE_DRIVER } from "config/constants";

import { ActiveOrder } from "./ActiveOrder";
import { useSetOrderAsAccepted } from "../hooks/useSetOrderAsAccepted";
import DeliveryConfirmationModal from "components/DeliverConfirmationModal";

interface ActiveOrdersProps {}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({}) => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
    fetchNextPage,
  } = useGetActiveOrders();

  const { mutate: validateTransaction } =
    useValidateStoreLocalCardTransaction();
  const { mutate: updateProductState } = useUpdateProductState();
  const { mutate: rejectOrder } = useRejectOrder();
  const { mutate: setOrderAsPreparing } = useSetOrderAsPreparing();
  const { mutate: setOrderAsReady } = useSetOrderAsReady();
  const { mutate: setOrderAsDelivered } = useSetOrderAsDelivered();
  const { mutate: setOrderAsAccepted } = useSetOrderAsAccepted();
  const [tabValue, setTabValue] = useState<string | null>("pending");

  //const { mutate } = useOrderControlers();

  // const [scroll] = useWindowScroll()
  // useEffect(() => {
  //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight && Array.isArray(orders?.pages)) {
  //     fetchNextPage({
  //       pageParam: orders?.pages[orders?.pages?.length - 1][orders?.pages[orders?.pages?.length - 1]?.length]?._id,
  //     })
  //   }
  // }, [scroll])
  const { userId, userDocument } = useUser();

  const storeDoc = userDocument?.storeDoc as { id: string };
  const storeDocId = storeDoc?.id;
  return (
    <Stack
      sx={{
        position: "relative",
      }}
    >
      {/* <Helmet>
        <title>{t(isLoading ? "Loading" : "Active Orders")}</title>
      </Helmet> */}
      <Tabs value={tabValue} onTabChange={setTabValue}>
        <Tabs.List>
          <Tabs.Tab value="pending">{t("Pending")}</Tabs.Tab>
          <Tabs.Tab value="accepted">{t("Accepted")}</Tabs.Tab>
          <Tabs.Tab value="paid">{t("Paid")}</Tabs.Tab>
          {/* <Tabs.Tab value="preparing">{t("Preparing")}</Tabs.Tab> */}
          <Tabs.Tab value="ready">{t("Ready")}</Tabs.Tab>
        </Tabs.List>

        {tabValue === "pending" && (
          <Tabs.Panel value="pending" pt="xs">
            {isLoading ? (
              <Loader />
            ) : isError ? (
              <Text>{JSON.stringify(error)}</Text>
            ) : orders?.pages?.flatMap((order) => order)?.length === 0 ? (
              <Box sx={{ width: "100%" }}>
                <Text m={"4px auto"}>{t("No active orders now")}</Text>
              </Box>
            ) : (
              orders?.pages?.map((page) => {
                return page
                  .filter((order) => {
                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );
                    return storeOrder.orderStatus === "pending";
                  })
                  .map((order) => {
                    const driver = order.status.find((status) => {
                      return status.userType === USER_TYPE_DRIVER;
                    });

                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );

                    return (
                      <ActiveOrder
                        setOrderAsDelivered={setOrderAsDelivered}
                        isLoading={isLoading}
                        order={order}
                        validateTransaction={validateTransaction}
                        storeOrder={storeOrder}
                        driver={driver}
                        userDocument={userDocument}
                        updateProductState={updateProductState}
                        rejectOrder={rejectOrder}
                        setOrderAsPreparing={setOrderAsPreparing}
                        setOrderAsReady={setOrderAsReady}
                        setOrderAsAccepted={setOrderAsAccepted}
                        status="pending"
                      />
                    );
                  });
              })
            )}
          </Tabs.Panel>
        )}
        {tabValue === "paid" && (
          <Tabs.Panel value="paid" pt="xs">
            {isLoading ? (
              <Loader />
            ) : isError ? (
              <Text>{JSON.stringify(error)}</Text>
            ) : orders?.pages?.flatMap((order) => order)?.length === 0 ? (
              <Box sx={{ width: "100%" }}>
                <Text m={"4px auto"}>{t("No active orders now")}</Text>
              </Box>
            ) : (
              orders?.pages?.map((page) => {
                return page
                  .filter((order) => {
                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );
                    return storeOrder.orderStatus === "paid";
                  })
                  .map((order) => {
                    const driver = order.status.find((status) => {
                      return status.userType === USER_TYPE_DRIVER;
                    });

                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );

                    return (
                      <ActiveOrder
                        setOrderAsDelivered={setOrderAsDelivered}
                        isLoading={isLoading}
                        order={order}
                        validateTransaction={validateTransaction}
                        storeOrder={storeOrder}
                        driver={driver}
                        userDocument={userDocument}
                        updateProductState={updateProductState}
                        rejectOrder={rejectOrder}
                        setOrderAsPreparing={setOrderAsPreparing}
                        setOrderAsReady={setOrderAsReady}
                        setOrderAsAccepted={setOrderAsAccepted}
                        status="paid"
                      />
                    );
                  });
              })
            )}
          </Tabs.Panel>
        )}
        {tabValue === "accepted" && (
          <Tabs.Panel value="accepted" pt="xs">
            {isLoading ? (
              <Loader />
            ) : isError ? (
              <Text>{JSON.stringify(error)}</Text>
            ) : orders?.pages?.flatMap((order) => order)?.length === 0 ? (
              <Box sx={{ width: "100%" }}>
                <Text m={"4px auto"}>{t("No active orders now")}</Text>
              </Box>
            ) : (
              orders?.pages?.map((page) => {
                return page
                  .filter((order) => {
                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );
                    return storeOrder.orderStatus === "accepted";
                  })
                  ?.map((order) => {
                    const driver = order.status.find((status) => {
                      return status.userType === USER_TYPE_DRIVER;
                    });

                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );

                    return (
                      <ActiveOrder
                        setOrderAsDelivered={setOrderAsDelivered}
                        isLoading={isLoading}
                        order={order}
                        validateTransaction={validateTransaction}
                        storeOrder={storeOrder}
                        driver={driver}
                        userDocument={userDocument}
                        updateProductState={updateProductState}
                        rejectOrder={rejectOrder}
                        setOrderAsPreparing={setOrderAsPreparing}
                        setOrderAsReady={setOrderAsReady}
                        status="accepted"
                      />
                    );
                  });
              })
            )}
          </Tabs.Panel>
        )}
        {/* {tabValue === "preparing" && (
          <Tabs.Panel value="preparing" pt="xs">
            {isLoading ? (
              <Loader />
            ) : isError ? (
              <Text>{JSON.stringify(error)}</Text>
            ) : orders?.pages?.flatMap((order) => order)?.length === 0 ? (
              <Box sx={{ width: "100%" }}>
                <Text m={"4px auto"}>{t("No active orders now")}</Text>
              </Box>
            ) : (
              orders?.pages?.map((page) => {
                return page
                  .filter((order) => {
                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );
                    return storeOrder.orderStatus === "preparing";
                  })
                  ?.map((order) => {
                    const driver = order.status.find((status) => {
                      return status.userType === USER_TYPE_DRIVER;
                    });

                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );

                    return (
                      <ActiveOrder
                        setOrderAsDelivered={setOrderAsDelivered}
                        isLoading={isLoading}
                        order={order}
                        validateTransaction={validateTransaction}
                        storeOrder={storeOrder}
                        driver={driver}
                        userDocument={userDocument}
                        updateProductState={updateProductState}
                        rejectOrder={rejectOrder}
                        setOrderAsPreparing={setOrderAsPreparing}
                        setOrderAsReady={setOrderAsReady}
                        status="preparing"
                      />
                    );
                  });
              })
            )}
          </Tabs.Panel>
        )} */}
        {tabValue === "ready" && (
          <Tabs.Panel value="ready" pt="xs">
            {isLoading ? (
              <Loader />
            ) : isError ? (
              <Text>{JSON.stringify(error)}</Text>
            ) : orders?.pages?.flatMap((order) => order)?.length === 0 ? (
              <Box sx={{ width: "100%" }}>
                <Text m={"4px auto"}>{t("No active orders now")}</Text>
              </Box>
            ) : (
              orders?.pages?.map((page) => {
                return page
                  .filter((order) => {
                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );
                    return storeOrder.orderStatus === "ready";
                  })
                  ?.map((order) => {
                    const driver = order.status.find((status) => {
                      return status.userType === USER_TYPE_DRIVER;
                    });

                    const storeOrder = order.orders.find(
                      (store) => store._id === storeDocId
                    );

                    return (
                      <ActiveOrder
                        setOrderAsDelivered={setOrderAsDelivered}
                        isLoading={isLoading}
                        order={order}
                        validateTransaction={validateTransaction}
                        storeOrder={storeOrder}
                        driver={driver}
                        userDocument={userDocument}
                        updateProductState={updateProductState}
                        rejectOrder={rejectOrder}
                        setOrderAsPreparing={setOrderAsPreparing}
                        setOrderAsReady={setOrderAsReady}
                        status="ready"
                      />
                    );
                  });
              })
            )}
          </Tabs.Panel>
        )}
      </Tabs>
      {/* <Box
        sx={{
          zIndex: 3,
          width: '100%',
          position: 'fixed',
          top: `${MENU_HEIGHT}px`,
        }}
      >
        <Container
          sx={{
            width: '100%',
            margin: '0px auto',
            height: 60,
            justifyContent: 'space-around',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Button
            variant="outline"
            sx={{
              width: '45%',
            }}
            component={Link}
            to={'orders/acceptedOrders'}
          >
            {t('Accepted')}
          </Button>
          <Button
            variant="outline"
            sx={{
              width: '45%',
            }}
            component={Link}
            to={'orders/preparingOrders'}
          >
            {t('Preparing')}
          </Button>
          <Button
            variant="outline"
            sx={{
              width: '45%',
            }}
            component={Link}
            to={'orders/readyOrders'}
          >
            {t('Ready')}
          </Button>
        </Container>
      </Box> */}
      {/* {isLoading ? (
        <Loader />
      ) : isError ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : orders?.pages?.flatMap((order) => order)?.length === 0 ? (
        <Box sx={{ width: '100%' }}>
          <Text m={'4px auto'}>{t('No active orders now')}</Text>
        </Box>
      ) : (
        orders?.pages?.map((page) => {
          return page?.map((order) => {
            const driver = order.status.find((status) => {
              return status.userType === USER_TYPE_DRIVER
            })

            const storeOrder = order.orders.find((store) => store._id === storeDocId)

            return (
              <ActiveOrder
                setOrderAsDelivered={setOrderAsDelivered}
                isLoading={isLoading}
                order={order}
                validateTransaction={validateTransaction}
                storeOrder={storeOrder}
                driver={driver}
                userDocument={userDocument}
                updateProductState={updateProductState}
                rejectOrder={rejectOrder}
                setOrderAsPreparing={setOrderAsPreparing}
                setOrderAsReady={setOrderAsReady}
              />
            )
          })
        })
      )} */}
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
                  orders?.pages[orders?.pages?.length - 1]?.length - 1
                ]?._id,
            });
          }}
        >
          {t("Load more")}
        </Button>
      </Center>
    </Stack>
  );
};

export default ActiveOrders;
