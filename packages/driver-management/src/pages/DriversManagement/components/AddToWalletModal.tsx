import {
  ActionIcon,
  Button,
  Center,
  Group,
  Modal,
  NumberInput,
  NumberInputHandlers,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { usePayWithLocalCard } from "hooks/usePayWithLocalCard";
import { t } from 'utils/i18nextFix';

import React, { useEffect, useRef, useState } from "react";
import { useCreateLocalCardTransactionForWallet } from "../hooks/useCreateLocalCardTransactionForWallet";

interface AddToWalletModalProps {
  balance: number;
}

const AddToWalletModal: React.FC<AddToWalletModalProps> = ({ balance }) => {
  const [opened, setOpened] = useState(false);
  //   const [amountToAdd, setAmountToAdd] = useState(0)
  const [value, setValue] = useState(0);
  const handlers = useRef<NumberInputHandlers>();
  const {
    mutate: createLocalCardTransaction,
    isLoading,
    isError,
    isSuccess,
    data,
    isIdle,
  } = useCreateLocalCardTransactionForWallet();
  const { colorScheme } = useMantineColorScheme();

  const [paying, setPaying] = useState(false);
  usePayWithLocalCard();
  useEffect(() => {
    if (isError) {
      setPaying(false);
    }
  });

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
          url: `${import.meta.env.VITE_APP_BASE_URL}/validateLocalCardTransaction`,
          colorScheme,
        }).toString();
      window.open(`${import.meta.env.VITE_APP_PAYMENT_APP_URL}` + queryString);

      // window.Lightbox.Checkout.configure = {
      //   ...configurationObject,

      //   completeCallback: function (data) {
      //     console.log(
      //       "🚀 ~ file: usePayWithLocalCard.ts ~ line 63 ~ useEffect ~ data success",
      //       data
      //     );
      //   },
      //   errorCallback: function (error) {
      //     console.log(error);
      //   },
      //   cancelCallback: function () {
      //     setPaying(false);
      //   },

      // window.Lightbox.Checkout.showLightbox();
    }
  }, [data, isLoading, isSuccess]);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Title>{t("Add to wallet")}</Title>
        <Center mt={24}>
          <Stack>
            <Group spacing={5}>
              <ActionIcon
                size={42}
                variant="default"
                onClick={() => handlers.current.decrement()}
              >
                –
              </ActionIcon>

              <NumberInput
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "$ "
                }
                hideControls
                value={value}
                onChange={(val) => setValue(val)}
                handlersRef={handlers}
                min={10}
                step={5}
                styles={{
                  input: { width: "fit-content", textAlign: "center" },
                }}
              />

              <ActionIcon
                size={42}
                variant="default"
                onClick={() => handlers.current.increment()}
              >
                +
              </ActionIcon>
            </Group>
            <Button
              disabled={isLoading || paying}
              onClick={() => {
                // TODO add transaction before opening the payment gateway
                createLocalCardTransaction({ amount: value });
                setPaying(true);
              }}
            >
              {t("Add")}
            </Button>
          </Stack>
        </Center>
      </Modal>
      <Button
        onClick={() => {
          setOpened(true);
        }}
      >
        {`${t("Wallet")} : ${balance}`}
      </Button>
      {/* <ActionIcon
        sx={{
          width: 'fit-content',
        }}
        onClick={() => setOpened(true)}
      >
        <Text>{`${t('Balance')} : ${balance}`}</Text>
      </ActionIcon> */}
    </>
  );
};

export default AddToWalletModal;
