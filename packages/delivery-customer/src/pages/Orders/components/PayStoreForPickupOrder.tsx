import {
  Box,
  Button,
  Group,
  Image,
  Modal,
  Select,
  Stack,
  Table,
  Text,
} from "@mantine/core";
// import PayWithLocalCard from 'components/PayWithLocalCard';
import {
  STORE_TYPE_RESTAURANT,
  storeAndCustomerServiceFee,
  storeServiceFee,
} from "hyfn-types";
import { paymentMethods } from "config/data";
import { t } from "util/i18nextFix";
import { useCreateLocalCardTransaction } from "pages/Orders/hooks/payStoreWithLocalCard/useCreateLocalCardTransaction";
import React, { forwardRef, useState } from "react";
import { useValidateStoreLocalCardTransaction } from "../hooks/payStoreWithLocalCard/useValidateStoreLocalCardTransaction";
import PayWithLocalCard from "components/PayWithLocalCard";
import { LOCAL_CARD_TRANSACTION_FLAG_STORE } from "hyfn-types";

interface PayStoreForPickupOrderProps {
  storeId: string;
  orderId: string;
  storeProducts: any[];
  store: any;
  order?: any;
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);

const PayStoreForPickupOrder: React.FC<PayStoreForPickupOrderProps> = ({
  storeId,
  orderId,
  storeProducts,
  store,
  order,
}) => {
  const [opened, setOpened] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(
    paymentMethods[0].value
  );
  const createLocalCardTransactionObject = useCreateLocalCardTransaction();
  const orderTotal = storeProducts.reduce((accu, currentProduct) => {
    return (
      accu + currentProduct.pricing.price * currentProduct?.pickup?.QTYFound
    );
  }, 0);
  const orderSaleFee = orderTotal * storeServiceFee;
  const orderTotalAfterFee = orderTotal - orderSaleFee;
  const orderCost = order?.orderCost;
  const restaurantOrder = store.storeType.includes(STORE_TYPE_RESTAURANT);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Box
          sx={(theme) => ({
            [theme.fn.smallerThan("md")]: {
              flexDirection: "column-reverse",
            },
            display: "flex",
            justifyContent: "space-between",
          })}
        >
          <Stack spacing={12}>
            {!restaurantOrder && (
              <Table>
                <thead>
                  <tr>
                    <th>{t("Name")}</th>
                    <th>{t("QTY found")}</th>
                    <th>{t("Image")}</th>
                  </tr>
                </thead>
                <tbody>
                  {storeProducts.map((product) => {
                    return (
                      <tr>
                        <td>{product?.textInfo?.title}</td>
                        <td>{product?.pickup?.QTYFound || 0}</td>
                        <td>
                          <Image
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
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
            <Stack m={"sm"}>
              <Group position="apart">
                <Text>{t("Order total")}</Text>
                <Text>{`${store.currency} ${
                  restaurantOrder ? orderCost : orderTotal
                }`}</Text>
              </Group>
              {/* <Group position="apart">
              <Text>{t('Order sale fee')}</Text>
              <Text>{orderSaleFee}</Text>
            </Group> */}
              {!restaurantOrder && (
                <Group position="apart">
                  <Text>{t("Order Total after fee")}</Text>
                  <Text>{`${store.currency} ${orderTotalAfterFee}`}</Text>
                </Group>
              )}
            </Stack>
            <>
              <Select
                data={paymentMethods}
                label={t("choose a payment method")}
                itemComponent={SelectItem}
                onChange={(e) => {
                  setSelectedPayment(e);
                }}
                value={selectedPayment}
              />

              {/* {selectedPayment === 'sadad' && <PayWithSadad orderId={orderId} storeId={storeId} />} */}
              {selectedPayment === "localCard" && (
                <PayWithLocalCard
                  flag={LOCAL_CARD_TRANSACTION_FLAG_STORE}
                  // validateTransaction={mutate}
                  orderId={orderId}
                  storeId={storeId}
                  createLocalCardTransaction={createLocalCardTransactionObject}
                  amount={orderTotalAfterFee}
                />
              )}
            </>
          </Stack>
        </Box>
      </Modal>
      <Button onClick={() => setOpened(true)}>{t("Pay Store")}</Button>
    </>
  );
};

export default PayStoreForPickupOrder;
