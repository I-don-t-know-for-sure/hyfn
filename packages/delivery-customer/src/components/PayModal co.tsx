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
import { useUser } from "contexts/userContext/User";

import {
  LOCAL_CARD_TRANSACTION_FLAG_SERVICE_FEE,
  LOCAL_CARD_TRANSACTION_FLAG_STORE,
  paymentMethods,
  paymentMethodsArray,
  storeServiceFee,
  STORE_TYPE_RESTAURANT,
  TRANSACTION_TYPE_MANAGMENT,
  LOCAL_CARD_TRANSACTION_FLAG_MANAGEMENT,
} from "hyfn-types";
import { add, equal, largerEq } from "mathjs";
import TransactionList from "components/TransactionList";
import { useCreateServiceFeeCardTransaction } from "pages/Orders/hooks/useCreateServiceFeeCardTransaction";
import React, { forwardRef, useState } from "react";
import { t } from "util/i18nextFix";
import PayWithLocalCardButton from "./PayWithLocalCardButton";
import { useCreateLocalCardTransaction } from "pages/Orders/hooks/payStoreWithLocalCard/useCreateLocalCardTransaction";
import { useCreateManagementLocalCardTransaction } from "hooks/useCreateManagmentLocalCardTransaction";

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

interface PayModalProps {
  storeId: string;
  orderId: string;
  storeProducts: any[];
  store: any;
  order?: any;
}

const PayModal: React.FC<PayModalProps> = ({
  orderId,
  store,
  storeId,
  storeProducts,
  order,
}) => {
  const createLocalCardTransaction = useCreateServiceFeeCardTransaction();
  const createStoreLocalCardTransaction = useCreateLocalCardTransaction();
  const createManagementLocalCardTransaction =
    useCreateManagementLocalCardTransaction();

  const [opened, setOpened] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethodsArray[0].value
  );
  const { userDocument } = useUser();
  const balance = userDocument.balance;
  //   const createLocalCardTransactionObject = useCreateLocalCardTransaction();
  const orderTotal = storeProducts.reduce((accu, currentProduct) => {
    return (
      accu + currentProduct.pricing.price * currentProduct?.pickup?.QTYFound
    );
  }, 0);
  const orderSaleFee = orderTotal * storeServiceFee;
  const orderTotalAfterFee = orderTotal - orderSaleFee;

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack spacing={12}>
          <Select
            data={paymentMethodsArray}
            onChange={(e) => setPaymentMethod(e)}
            value={paymentMethod}
            label={t("Choose a payment method")}
            itemComponent={SelectItem}
          />
          <TransactionList />

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
                        src={`${import.meta.env.VITE_APP_BUCKET_URL}/tablet/${
                          product.images[0]
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Stack m={"sm"}>
            <Group position="apart">
              <Text>{t("Order total")}</Text>
              <Text>{`${store.currency} ${orderTotal}`}</Text>
            </Group>
            <Group position="apart">
              <Text>{t("Service fee")}</Text>
              <Stack spacing={2}>
                <Text>{`${store.currency} ${add(
                  orderSaleFee,
                  order.serviceFee
                )}`}</Text>
                {!!add(orderSaleFee, order.serviceFee) && (
                  <PayWithLocalCardButton
                    createLocalCardTransaction={createLocalCardTransaction}
                    flag={LOCAL_CARD_TRANSACTION_FLAG_SERVICE_FEE}
                    // isBalanceEnough={largerEq(balance, orderSaleFee) as boolean}
                    orderId={orderId}
                    storeId={storeId}
                  />
                )}
              </Stack>
            </Group>
            <Group position="apart">
              <Text>{t("Delivery fee")}</Text>
              <Stack spacing={2}>
                <Text>{`${store.currency} ${order.deliveryFee}`}</Text>
                {!!order.deliveryFee && (
                  <PayWithLocalCardButton
                    createLocalCardTransaction={
                      createManagementLocalCardTransaction
                    }
                    flag={LOCAL_CARD_TRANSACTION_FLAG_MANAGEMENT}
                    isBalanceEnough={largerEq(balance, orderSaleFee) as boolean}
                    orderId={orderId}
                    storeId={storeId}
                  />
                )}
              </Stack>
            </Group>

            <Group position="apart">
              <Text>{t("Order Total after fee")}</Text>

              <Stack spacing={2}>
                <Text>{`${store.currency} ${orderTotalAfterFee}`}</Text>
                {!!orderTotalAfterFee && (
                  <PayWithLocalCardButton
                    createLocalCardTransaction={createStoreLocalCardTransaction}
                    flag={LOCAL_CARD_TRANSACTION_FLAG_STORE}
                    //   isBalanceEnough={equal(orderSaleFee, balance) as boolean}
                    orderId={orderId}
                    storeId={storeId}
                  />
                )}
              </Stack>
            </Group>
          </Stack>
        </Stack>
      </Modal>
      <Button onClick={() => setOpened(true)}>{t("Pay")}</Button>
    </>
  );
};

export default PayModal;
