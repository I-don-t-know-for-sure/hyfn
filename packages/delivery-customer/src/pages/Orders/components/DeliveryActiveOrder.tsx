import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  LoadingOverlay,
  Table,
  Text,
} from "@mantine/core";
import React from "react";
import { largerEq } from "mathjs";
import TransactionModal from "./TransactionModal";
import { t } from "../../../util/i18nextFix";
import OptionsModal from "./OptionsModal";
import DeliveryConfirmationModal from "../../../components/DeliverConfirmationModal";
import OrderActionMenu from "./OrderActionMenu";

import PayServiceFeeModal from "./PayServiceFeeModal";
import DriverInfoModal from "./DriverInfoModal";
import {
  ORDER_TYPE_DELIVERY,
  STORE_STATUS_PENDING,
  STORE_TYPE_RESTAURANT,
} from "../../../config/constents";
import { useRefreshOrderDocument } from "../hooks/useRefreshOrderDocument";
import PayStoreForPickupOrder from "./PayStoreForPickupOrder";
import ProposalsModal from "./ProposalsModal";
import { ORDER_STATUS_ACCEPTED } from "hyfn-types";
import PayModal from "components/PayModal";
import DeliveredModal from "components/DeliveredModal";
import { CopyButton } from "hyfn-client";

interface DeliveryActiveOrderProps {
  index: any;
  order: any;
  driver: any;
  validateTransaction: any;
  cancelOrder: any;
  balance: number;
  serviceFee: string;
  serviceFeePaid: boolean;
}

const DeliveryActiveOrder: React.FC<DeliveryActiveOrderProps> = ({
  cancelOrder,
  driver,
  index,
  order,
  validateTransaction,
  balance,
  serviceFee,
  serviceFeePaid,
}) => {
  console.log(
    "🚀 ~ file: DeliveryActiveOrder.tsx:37 ~ serviceFee",
    typeof serviceFee
  );
  console.log(
    "🚀 ~ file: DeliveryActiveOrder.tsx:37 ~ serviceFeePaid",
    serviceFeePaid
  );
  console.log("🚀 ~ file: DeliveryActiveOrder.tsx:34 ~ order", order);

  const { refetch, isLoading } = useRefreshOrderDocument({
    orderId: order._id.toString(),
  });
  return (
    <Card key={index} mt={8}>
      <LoadingOverlay
        visible={isLoading}
        sx={{
          width: "100%",
          height: "100%",
        }}
      />
      {
        <Group position="apart">
          <Badge
            color={
              order?.orders[0]?.orderStatus === STORE_STATUS_PENDING
                ? "red"
                : "green"
            }
          >
            {order?.orders[0]?.orderStatus}
          </Badge>

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
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
              </svg>
            </ActionIcon>
            <OrderActionMenu
              orderType={order.orderType}
              isOrderTakenByDriver={driver?._id !== ""}
              orderId={order._id.toString()}
            />
          </Group>
        </Group>
      }
      <Group
        position={driver?._id !== "" && !serviceFeePaid ? "apart" : "right"}
      >
        {/* {order.orders[0].orderStatus === ORDER_STATUS_ACCEPTED &&
          !serviceFeePaid && (
            <PayServiceFeeModal
              orderId={order._id.toString()}
              balance={balance}
              serviceFee={serviceFee}
              customerBalanceIsSufficient={
                !!largerEq(parseFloat(balance as any), parseFloat(serviceFee))
              }
            />
          )} */}

        {/* <Group position="right">
          <>
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
              orderId={order._id.toString()}
            />
          </>
        </Group> */}
      </Group>
      <Group
        mt={8}
        mb={8}
        // sx={{
        //   verticalAlign: "baseline",
        // }}
        position="apart"
      >
        <Box
          sx={(theme) => ({
            [theme.fn.smallerThan("sm")]: {
              maxWidth: "180px",
              overflow: "hidden",
            },
          })}
        >
          <CopyButton justText value={order._id.toString()} />
        </Box>
        {/* <Text>{order._id.toString()}</Text> */}
        {order.orderType === ORDER_TYPE_DELIVERY && (
          <ProposalsModal
            orderId={order._id.toString()}
            proposals={order?.proposals}
          />
        )}
      </Group>
      {/* <Group mt={12} position="right">
        {driver._id !== '' && <DriverInfoModal driverId={driver._id} />}
      </Group> */}
      {Object.keys(order.orders).map((key) => {
        const store = order?.orders[key];
        console.log(store, "hshsshshhshss");
        return (
          <Box
            key={key}
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
              {/* {order.orders[0].orderStatus === ORDER_STATUS_ACCEPTED && (
                <PayStoreForPickupOrder
                  order={order}
                  orderId={order._id.toString()}
                  storeId={store._id}
                  storeProducts={store.addedProducts}
                  store={store}
                />
              )} */}
              {true && (
                <PayModal
                  order={order}
                  orderId={order._id.toString()}
                  storeId={store._id}
                  storeProducts={store.addedProducts}
                  store={store}
                />
              )}
              {Array.isArray(store.transactions) && (
                <TransactionModal
                  validateTransaction={validateTransaction}
                  transactions={store.transactions}
                />
              )}
            </Group>
            <Box
              sx={(theme) => ({
                [theme.fn.smallerThan("sm")]: {
                  overflowX: "scroll",
                },
                width: "100%",
              })}
            >
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
                          {product.options.length > 0 ? (
                            <OptionsModal options={product.options} />
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
            {/* we can uncomment this when we start allowing orders to have more than one store in them */}
            {/* <Box sx={{}}>
              {true && (
                <Group mb={8}>
                <Button
                onClick={() => {
                  console.log({
                    orderId: order._id,
                    storeId: store._id,
                  });

                      cancelOrder({
                        orderId: order._id,
                        storeId: store._id,
                      });
                    }}
                  >
                    {t('cancel')}
                  </Button>
                
                </Group>
              )}
            </Box> */}
          </Box>
        );
      })}
      <Group>
        {order.orderType === ORDER_TYPE_DELIVERY ? (
          <DeliveryConfirmationModal
            confirmationCode={order?.confirmationCode}
            orderId={order._id.toString()}
          />
        ) : (
          <DeliveredModal orderId={order._id} />
        )}
      </Group>
    </Card>
  );
};

export default DeliveryActiveOrder;
