import {
  Button,
  Center,
  NumberInput,
  useMantineColorScheme,
} from "@mantine/core";
import { usePayWithLocalCard } from "hooks/usePayWithLocalCard";
import { t } from "utils/i18nextFix";
import { useEffect, useState } from "react";
import { useCreateLocalCardTransaction } from "../hooks/payWithLocalCard/useCreateLocalCardTransaction";

export const PayWithLocalCard: React.FC = () => {
  const [amountToPay, setAmountToPay] = useState(0);
  const {
    mutate: createLocalCardTransaction,
    data,
    isLoading,
    isSuccess,
    isIdle,
  } = useCreateLocalCardTransaction();
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
          url: `${
            import.meta.env.VITE_APP_BASE_URL
          }/validateLocalCardTransaction`,
          colorScheme,
        }).toString();
      window.open(import.meta.env.VITE_APP_PAYMENT_APP_URL + queryString);
      // window.Lightbox.Checkout.configure = {
      //   ...configurationObject,

      //   completeCallback: function (data) {
      //     console.log('🚀 ~ file: usePayWithLocalCard.ts ~ line 63 ~ useEffect ~ data success', data)
      //   },
      //   errorCallback: function (error) {
      //     console.log(error)
      //   },
      //   cancelCallback: function () {
      //     setPaying(false)
      //   },
      // }
      // window.Lightbox.Checkout.showLightbox()
    }
  }, [data, isLoading, isSuccess]);

  return (
    <>
      {/* <NumberInput label={t('Amount to pay')} value={amountToPay} onChange={(e) => setAmountToPay(e)} /> */}
      <Center>
        <NumberInput
          label={t("Amount to add to wallet")}
          value={amountToPay}
          onChange={(e) => setAmountToPay(e as number)}
        />

        <Button
          mt={12}
          sx={{ margin: "0px auto" }}
          disabled={isLoading || paying}
          onClick={() => {
            // TODO add transaction before opening the payment gateway
            setPaying(true);
            createLocalCardTransaction({ amount: amountToPay });
          }}
        >
          {t("Show payment gateway")}
        </Button>
      </Center>
    </>
  );
};
