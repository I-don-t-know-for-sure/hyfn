import { Box, Button, Group, Modal, Select, Text } from "@mantine/core";
import { ServiceFeePayment } from "components/PayServiceFee";

import { paymentMethods } from "config/data";
import { t } from "util/i18nextFix";
import { useCreateLocalCardTransaction } from "pages/Orders/hooks/payStoreWithLocalCard/useCreateLocalCardTransaction";
import React, { forwardRef, useState } from "react";
import { usePayServiceFee } from "../hooks/usePayServiceFee";
import { useCreateServiceFeeCardTransaction } from "../hooks/useCreateServiceFeeCardTransaction";
import { largerEq } from "mathjs";

interface PayServiceFeeModalProps {
  orderId: string;
  balance: any;
  customerBalanceIsSufficient: any;
  serviceFee: string;
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

const PayServiceFeeModal: React.FC<PayServiceFeeModalProps> = ({
  orderId,
  balance,
  customerBalanceIsSufficient,
  serviceFee,
}) => {
  const result = largerEq(parseFloat(balance as any), parseFloat(serviceFee));

  console.log("🚀 ~ file: PayServiceFeeModal.tsx:38 ~ serviceFee", serviceFee);
  const [opened, setOpened] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(
    paymentMethods[0].value
  );
  const createLocalCardTransaction = useCreateServiceFeeCardTransaction();
  const { mutate: payServiceFee } = usePayServiceFee();
  console.log(selectedPayment);

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
          <ServiceFeePayment
            flag={"serviceFee:order"}
            createLocalCardTransaction={createLocalCardTransaction}
            balance={balance}
            customerBalanceIsSuffictient={result}
            paymentMethod={selectedPayment}
            setPaymentMethod={setSelectedPayment}
            serviceFee={serviceFee}
            orderId={orderId}
          />
          {result && (
            <Button
              fullWidth
              onClick={() => {
                payServiceFee({ orderId });
              }}
            >
              {t("Pay")}
            </Button>
          )}
          {/* <Select
          data={paymentMethods}
          label={t('choose a payment method')}
          itemComponent={SelectItem}
          onChange={(e) => {
            setSelectedPayment(e);
          }}
          value={selectedPayment}
        /> */}

          {/* {selectedPayment === 'sadad' && <PayWithSadad orderId={orderId} storeId={storeId} />} */}
          {/* {selectedPayment === 'localCard' && <PayWithLocalCard orderId={orderId} />} */}
        </Box>
      </Modal>
      <Button onClick={() => setOpened(true)}>{t("Pay Service fee")}</Button>
    </>
  );
};

export default PayServiceFeeModal;
