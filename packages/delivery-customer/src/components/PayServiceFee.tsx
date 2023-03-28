import { Box, Group, Select, Text } from "@mantine/core";
import { paymentMethods } from "config/data";
import { t } from "util/i18nextFix";
import PayWithLocalCard from "components/PayWithLocalCard";
import TransactionList from "components/TransactionList";
import { forwardRef } from "react";

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

export function ServiceFeePayment({
  balance,
  customerBalanceIsSuffictient: customerBalanceIsSufficient,
  paymentMethod,
  serviceFee,
  setPaymentMethod,
  createLocalCardTransaction,
  orderId,
  flag,
}: {
  customerBalanceIsSuffictient: any;
  flag: string;
  paymentMethod: string;
  balance: any;
  serviceFee: any;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  createLocalCardTransaction: any;
  orderId?: string;
}) {
  return (
    <Box
      sx={(theme) => ({
        [theme.fn.smallerThan("md")]: {
          flexDirection: "column-reverse",
        },
        display: "flex",
        justifyContent: "space-between",
      })}
    >
      {!customerBalanceIsSufficient && (
        <Box>
          {/* {paymentMethod === 'sadad' && <PayWithSadad balanceNumber={balance} serviceFee={serviceFee} />} */}
          {paymentMethod === "localCard" && (
            <PayWithLocalCard
              flag={flag}
              createLocalCardTransaction={createLocalCardTransaction}
              balanceNumber={balance}
              serviceFee={serviceFee}
              orderId={orderId}
            />
          )}
        </Box>
      )}
      {customerBalanceIsSufficient && (
        <Text>{t("Your balance is suffictient for making this order")}</Text>
      )}
      <Box>
        <TransactionList />
        <Select
          data={paymentMethods}
          onChange={(e) => setPaymentMethod(e)}
          value={paymentMethod}
          label={t("choose a payment method")}
          itemComponent={SelectItem}
        />
      </Box>
    </Box>
  );
}
