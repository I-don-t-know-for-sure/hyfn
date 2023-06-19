// create a react component

import {
  Box,
  Button,
  Group,
  Modal,
  Select,
  SelectItemProps,
  Text,
} from "@mantine/core";
import { TransactionList } from "hyfn-client";
import { forwardRef, useState } from "react";
import { PayWithLocalCard } from "./PayWithLocalCard";
import { t } from "utils/i18nextFix";
import { paymentMethods } from "config/data";
import { useGetTransactions } from "hooks/useGetTransactions";
import { useValidateLocalCardTransaction } from "hooks/useValidateLocalCardTransaction";
import { useCancelTransaction } from "hooks/useCancelTransaction";

interface PaymentModalProps {
  balance: number;
}
const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ label, ...others }: SelectItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);
const PaymentModal: React.FC<PaymentModalProps> = ({ balance }) => {
  const [opened, setOpened] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TransactionList
            useCancelTransaction={useCancelTransaction}
            useGetTransactions={useGetTransactions}
            useValidateTransaction={useValidateLocalCardTransaction}
          />
        </Box>
        <Group
          grow
          sx={(theme) => ({
            [theme.fn.smallerThan("sm")]: {
              flexDirection: "column-reverse",
            },
            display: "flex",
            justifyContent: "space-between",
          })}
        >
          {/* {paymentMethods[0].value === paymentMethod && <PayWithSadad />} */}
          {paymentMethods[0].value === paymentMethod && <PayWithLocalCard />}

          <Box>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e)}
              required
              data={paymentMethods}
              label={t("choose a payment method")}
              itemComponent={SelectItem}
            />
          </Box>
        </Group>
      </Modal>
      <Button onClick={() => setOpened(true)}>{`${t(
        "Wallet"
      )} : ${balance.toFixed(2)} `}</Button>
    </>
  );
};

export default PaymentModal;
