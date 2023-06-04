import { Button, Center, useMantineColorScheme } from "@mantine/core";

import { t } from "util/i18nextFix";
import React, { useEffect, useState } from "react";

import { usePayWithLocalCard } from "../pages/CheckOut/hooks/usePayWithLocalCard";
import {
  LOCAL_CARD_TRANSACTION_FLAG_SERVICE_FEE,
  LOCAL_CARD_TRANSACTION_FLAG_DRIVER_MANAGEMENT,
  LOCAL_CARD_TRANSACTION_FLAG_STORE,
} from "hyfn-types";
import { usePayServiceFee } from "pages/Orders/hooks/usePayServiceFee";

interface PayWithLocalCardButtonProps {
  serviceFee?: any;
  balanceNumber?: any;
  createLocalCardTransaction: any;
  orderId?: string;
  storeId?: string;
  amount?: number;
  flag: string;
  isBalanceEnough?: boolean;
  payServiceFee?: any;
}

// TODO refactor this to one Component to pay the store and us and give it

const PayWithLocalCardButton: React.FC<PayWithLocalCardButtonProps> = ({
  createLocalCardTransaction,
  orderId,
  storeId,

  flag,
  isBalanceEnough,
}) => {
  const [amountToPay, setAmountToPay] = useState(0);
  const { mutate: payServiceFee } = usePayServiceFee();

  // const { mutate: createLocalCardTransaction, data, isLoading, isSuccess, isIdle } = useCreateLocalCardTransaction();
  const {
    mutate: createTransaction,
    data,
    isLoading,
    isSuccess,
    isIdle,
  } = createLocalCardTransaction;

  const { colorScheme } = useMantineColorScheme();

  const [paying, setPaying] = useState(false);
  usePayWithLocalCard();
  useEffect(() => {
    if (!isLoading && isSuccess && data && !isIdle) {
      const { configurationObject } = data;
      console.log(
        "🚀 ~ file: PayWithLocalCard.tsx ~ line 20 ~ useEffect ~ configurationObject",
        configurationObject
      );
      const queryString =
        "?" +
        new URLSearchParams({
          ...configurationObject,
          url: `${import.meta.env.VITE_APP_BASE_URL}/${
            flag === LOCAL_CARD_TRANSACTION_FLAG_STORE
              ? "validateStoreLocalCardTransaction"
              : "validateLocalCardTransaction"
          }`,
          colorScheme,
        }).toString();
      window.open(`${import.meta.env.VITE_APP_PAYMENT_APP_URL}` + queryString);
      // window.Lightbox.Checkout.configure = {
      //   ...configurationObject,

      //   completeCallback: function (data) {
      //     console.log('🚀 ~ file: usePayWithLocalCard.ts ~ line 63 ~ useEffect ~ data success', data);
      //   },
      //   errorCallback: function (error) {
      //     console.log(error);
      //   },
      //   cancelCallback: function () {
      //     setPaying(false);
      //   },
      // };
      // window.Lightbox.Checkout.showLightbox();
    }
  }, [data, isLoading, isSuccess]);

  return (
    <>
      <Center>
        <Button
          fullWidth
          // mt={12}
          sx={{ margin: "0px auto" }}
          compact
          // disabled={balanceNumber > serviceFee}
          onClick={() => {
            // TODO add transaction before opening the payment gateway
            setPaying(true);
            if (flag === LOCAL_CARD_TRANSACTION_FLAG_DRIVER_MANAGEMENT) {
              createTransaction({ orderId });
              return;
            }
            if (flag === LOCAL_CARD_TRANSACTION_FLAG_SERVICE_FEE) {
              if (isBalanceEnough) {
                payServiceFee({ orderId });
                return;
              }
              createTransaction({ orderId });
              return;
            }
            if (flag === LOCAL_CARD_TRANSACTION_FLAG_STORE) {
              console.log(
                "🚀 ~ file: PayWithLocalCardButton.tsx:111 ~ LOCAL_CARD_TRANSACTION_FLAG_STORE:",
                LOCAL_CARD_TRANSACTION_FLAG_STORE
              );

              createTransaction({ orderId, storeId });
              return;
            }
            createTransaction({ amount: amountToPay });
            // createTransaction({ amount: amountToPay });
          }}
        >
          {t("Pay")}
        </Button>
      </Center>
    </>
  );
};

export default PayWithLocalCardButton;
