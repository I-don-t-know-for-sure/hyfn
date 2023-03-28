import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  CloseButton,
  Group,
  Image,
  LoadingOverlay,
  Space,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import React from "react";
import { IoMdCopy } from "react-icons/io";

import PayStoreModal from "./PayStoreModal/PayStoreModal";
import TransactionModal from "./TransactionModal";
import { t } from "../../../util/i18nextFix";
import OptionsModal from "./OptionsModal";
import OrderActionMenu from "./OrderActionMenu";

import PayStoreForPickupOrder from "./PayStoreForPickupOrder";
import { useRefreshOrderDocument } from "../hooks/useRefreshOrderDocument";
import TextToCopy from "./TextToCopy";
import { useSetOrderAsDelivered } from "../hooks/useSetOrderAsDelivered";

import {
  STORE_STATUS_PENDING,
  STORE_TYPE_RESTAURANT,
} from "../../../config/constents";

interface PickupActiveOrderProps {
  order: any;
  payStore;
  validateStoreLocalCardTransaction;
  // clipboard: { copy: (valueToCopy: any) => void; reset: () => void; error: Error; copied: boolean };
  clipboard: any;
  setProductAsPickedUp;
  setProductAsNotFound;
  setOrderAsDelivered: any;
  index: number;
}

const PickupActiveOrder: React.FC<PickupActiveOrderProps> = ({
  clipboard,
  order,

  setProductAsNotFound,
  setProductAsPickedUp,
  index,
  validateStoreLocalCardTransaction,
}) => {
  console.log("🚀 ~ file: PickupActiveOrder.tsx:34 ~ order", order);
  const { refetch, isLoading } = useRefreshOrderDocument({
    orderId: order._id.toString(),
  });
  const { mutate: setOrderAsDelivered } = useSetOrderAsDelivered();

  return (
    <Card m={"24px auto"}>
      <Stack>
        <LoadingOverlay
          visible={isLoading}
          sx={{
            width: "100%",
            height: "100%",
          }}
        />
        {order?.orders[0]?.storeType?.includes(STORE_TYPE_RESTAURANT) && (
          <Group>
            <Badge
              color={
                order?.orders[0]?.orderStatus === STORE_STATUS_PENDING
                  ? "red"
                  : "green"
              }
            >
              {order?.orders[0]?.orderStatus}
            </Badge>
          </Group>
        )}
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
            isOrderTakenByDriver={false}
            orderId={order._id.toString()}
          />
        </Group>
        <Group position="apart" m={"md"}>
          <Text>{order._id.toString()}</Text>
        </Group>
        {order?.orders?.map((store) => {
          console.log(store, "hshsshshhshss");
          return (
            <Box
              key={store._id.toString()}
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
                <PayStoreForPickupOrder
                  order={order}
                  orderId={order._id.toString()}
                  storeId={store._id}
                  storeProducts={store.addedProducts}
                  store={store}
                />
                <Space w={10} />
                {Array.isArray(store.transactions) && (
                  <TransactionModal
                    validateTransaction={validateStoreLocalCardTransaction}
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
            </Box>
          );
        })}

        <Button
          onClick={() => {
            setOrderAsDelivered({ orderId: order._id.toString() });
          }}
        >
          {t("Set as Delivered")}
        </Button>
      </Stack>
    </Card>
  );
};

export default PickupActiveOrder;
