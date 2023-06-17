import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  Image,
  LoadingOverlay,
  Table,
  Text
} from "@mantine/core";
import React from "react";

import { t } from "../../../util/i18nextFix";
import OptionsModal from "./OptionsModal";
import DeliveryConfirmationModal from "../../../components/DeliverConfirmationModal";
import OrderActionMenu from "./OrderActionMenu";

import { useRefreshOrderDocument } from "../hooks/useRefreshOrderDocument";

import PayModal from "components/PayModal";
import DeliveredModal from "components/DeliveredModal";
import { CopyTextButton } from "hyfn-client";
import { orderTypesObject, storeStatusObject } from "hyfn-types";

interface DeliveryActiveOrderProps {
  index: any;
  order: any;

  cancelOrder: any;
  balance: number;
  serviceFee: number;
  serviceFeePaid: boolean;
}

const DeliveryActiveOrder: React.FC<DeliveryActiveOrderProps> = ({
  cancelOrder,

  index,
  order,

  serviceFee,
  serviceFeePaid
}) => {
  const { refetch, isLoading } = useRefreshOrderDocument({
    orderId: order.id
  });
  return (
    <Card key={index} mt={8}>
      <LoadingOverlay
        visible={isLoading}
        sx={{
          width: "100%",
          height: "100%"
        }}
      />
      {
        <Group position="apart">
          <Badge
            color={
              order?.storeStatus[order?.storeStatus.length - 1] ===
              storeStatusObject.pending
                ? "red"
                : "green"
            }>
            {order?.storeStatus[order?.storeStatus.length - 1]}
          </Badge>

          <Group>
            <ActionIcon
              onClick={() => {
                refetch();
              }}>
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
                strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
              </svg>
            </ActionIcon>
            <OrderActionMenu
              orderType={order.orderType}
              isOrderTakenByDriver={order.storeStatus.includes("paid")}
              orderId={order.id}
            />
          </Group>
        </Group>
      }
      <Group position={"right"}></Group>
      <Group
        mt={8}
        mb={8}
        // sx={{
        //   verticalAlign: "baseline",
        // }}
        position="apart">
        <Box
          sx={(theme) => ({
            [theme.fn.smallerThan("sm")]: {
              maxWidth: "180px",
              overflow: "hidden"
            }
          })}>
          <CopyTextButton justText value={order.id} />
        </Box>
      </Group>

      {order.stores.map((store) => {
        console.log(store, "hshsshshhshss");
        return (
          <Box
            key={store.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
            <Group position="apart">
              <Text
                variant="text"
                weight={600}
                sx={{
                  fontSize: "24px",
                  margin: "4px auto"
                }}>
                {store.storeName || store.businessName}
              </Text>

              {true && (
                <PayModal
                  order={order}
                  orderId={order.id}
                  storeId={store.id}
                  storeProducts={order.addedProducts}
                  store={store}
                />
              )}
            </Group>
            <Box
              sx={(theme) => ({
                [theme.fn.smallerThan("sm")]: {
                  overflowX: "scroll"
                },
                width: "100%"
              })}>
              <Table>
                <thead>
                  <tr>
                    <th>{t("Name")}</th>
                    <th>{t("Quantity")}</th>
                    <th>{t("Image")}</th>
                    <th>{t("Options")}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.addedProducts.map((product, index) => {
                    console.log(product);

                    return (
                      <tr key={index}>
                        {/* <td>{index + 1}</td> */}
                        <td>
                          <Text>{product.title}</Text>
                        </td>
                        <td>{product.qty}</td>
                        <td>
                          <Image
                            radius={4}
                            sx={{
                              width: "45px",
                              height: "45px",
                              maxWidth: "45px",
                              maxHeight: "45px"
                            }}
                            src={`${
                              import.meta.env.VITE_APP_BUCKET_URL
                            }/tablet/${product.images[0]}`}
                          />
                        </td>
                        <td>
                          {product?.options?.length > 0 ? (
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
          </Box>
        );
      })}
      <Group>
        {order.orderType === orderTypesObject.Delivery ? (
          <DeliveryConfirmationModal
            confirmationCode={order?.confirmationCode}
            orderId={order.id}
          />
        ) : (
          <DeliveredModal orderId={order.id} />
        )}
      </Group>
    </Card>
  );
};

export default DeliveryActiveOrder;
