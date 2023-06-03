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
} from "hyfn-client";
import { useUser } from "contexts/userContext/User";

import {
  transactionMethods,
  storeServiceFee,
  serviceFeePayment,
  managementPayment,
  storePayment,
  currencies,
} from "hyfn-types";
import { add } from "mathjs";
import TransactionList from "components/TransactionList";

import React, { forwardRef, useState } from "react";
import { t } from "util/i18nextFix";

import { useCreateTransaction } from "hooks/useCreateTransaction";
import { useLocation } from "contexts/locationContext/LocationContext";

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
  const { mutate: createTransaction } = useCreateTransaction();
  const [{ country }] = useLocation();
  const [opened, setOpened] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>(
    transactionMethods[0]
  );
  const { userDocument } = useUser();
  const balance = userDocument.balance;
  //   const createLocalCardTransactionObject = useCreateLocalCardTransaction();
  const orderTotal = storeProducts.reduce((accu, currentProduct) => {
    return accu + currentProduct.price * currentProduct?.qtyFound;
  }, 0);
  const orderSaleFee = orderTotal * storeServiceFee;
  const orderTotalAfterFee = orderTotal - orderSaleFee;

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Stack spacing={12}>
          <Select
            data={transactionMethods.map((method) => {
              return { label: t(method), value: method };
            })}
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
                    <td>{product?.title}</td>
                    <td>{product?.qtyFound || 0}</td>
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
              <Text>{`${currencies[store.country]} ${orderTotal}`}</Text>
            </Group>
            <Group position="apart">
              <Text>{t("Service fee")}</Text>
              <Stack spacing={2}>
                <Text>{`${currencies[store.country]} ${add(
                  orderSaleFee,
                  order.serviceFee
                )}`}</Text>
                {!!add(orderSaleFee, order.serviceFee) && (
                  <Button
                    onClick={() => {
                      createTransaction({
                        type: serviceFeePayment,
                        country,
                        orderId,
                      });
                    }}
                  >
                    {t("Pay")}
                  </Button>
                  // <PayWithLocalCardButton
                  //   createLocalCardTransaction={createLocalCardTransaction}
                  //   flag={LOCAL_CARD_TRANSACTION_FLAG_SERVICE_FEE}
                  //   // isBalanceEnough={largerEq(balance, orderSaleFee) as boolean}
                  //   orderId={orderId}
                  //   storeId={storeId}
                  // />
                )}
              </Stack>
            </Group>
            {!!order.deliveryFee && (
              <Group position="apart">
                <Text>{t("Delivery fee")}</Text>
                <Stack spacing={2}>
                  <Text>{`${currencies[store.country]} ${
                    order.deliveryFee
                  }`}</Text>
                  {true && (
                    <Button
                      onClick={() => {
                        createTransaction({
                          type: managementPayment,
                          country,
                          orderId,
                        });
                      }}
                    >
                      {t("Pay")}
                    </Button>
                    // <PayWithLocalCardButton
                    //   createLocalCardTransaction={
                    //     createManagementLocalCardTransaction
                    //   }
                    //   flag={LOCAL_CARD_TRANSACTION_FLAG_MANAGEMENT}
                    //   isBalanceEnough={largerEq(balance, orderSaleFee) as boolean}
                    //   orderId={orderId}
                    //   storeId={storeId}
                    // />
                  )}
                </Stack>
              </Group>
            )}
            <Group position="apart">
              <Text>{t("Order Total after fee")}</Text>

              <Stack spacing={2}>
                <Text>{`${
                  currencies[store.country]
                } ${orderTotalAfterFee}`}</Text>
                {!!orderTotalAfterFee && (
                  <Button
                    onClick={() => {
                      createTransaction({
                        type: storePayment,
                        country,
                        orderId,
                        storeId,
                      });
                    }}
                  >
                    {t("Pay")}
                  </Button>
                  // <PayWithLocalCardButton
                  //   createLocalCardTransaction={createStoreLocalCardTransaction}
                  //   flag={LOCAL_CARD_TRANSACTION_FLAG_STORE}
                  //   //   isBalanceEnough={equal(orderSaleFee, balance) as boolean}
                  //   orderId={orderId}
                  //   storeId={storeId}
                  // />
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
