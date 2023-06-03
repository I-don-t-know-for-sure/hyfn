import { Box, Button, Group, Modal, Select, Text } from "hyfn-client";

import { paymentMethods } from "config/data";
import { t } from "util/i18nextFix";
import { useCreateLocalCardTransaction } from "pages/Orders/hooks/payStoreWithLocalCard/useCreateLocalCardTransaction";
import React, { forwardRef, useState } from "react";

import { useValidateStoreLocalCardTransaction } from "pages/Orders/hooks/payStoreWithLocalCard/useValidateStoreLocalCardTransaction";
import PayWithLocalCard from "components/PayWithLocalCard";

interface PayStoreModalProps {
  storeId: string;
  orderId: string;
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

const PayStoreModal: React.FC<PayStoreModalProps> = ({ storeId, orderId }) => {
  const [opened, setOpened] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(
    paymentMethods[0].value
  );
  const createLocalCardTransactionObject = useCreateLocalCardTransaction();
  const { mutate } = useValidateStoreLocalCardTransaction();
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
              flag="store"
              // validateTransaction={mutate}
              createLocalCardTransaction={createLocalCardTransactionObject}
              orderId={orderId}
              storeId={storeId}
            />
          )}
        </Box>
      </Modal>
      <Button onClick={() => setOpened(true)}>{t("Pay Store")}</Button>
    </>
  );
};

export default PayStoreModal;
