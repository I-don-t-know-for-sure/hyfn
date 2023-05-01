import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  NumberInput,
  NumberInputHandlers,
  Paper,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { Tab } from "@mantine/core/lib/Tabs/Tab/Tab";
import { currencies } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { usePayWithLocalCard } from "hooks/usePayWithLocalCard";
import { t } from "utils/i18nextFix";
import { useCreateLocalCardTransactionForWallet } from "pages/DriversManagement/hooks/useCreateLocalCardTransactionForWallet";

import React, { useEffect, useRef, useState } from "react";
import { useCreatePaymentRequest } from "./hooks/useCreatePaymentRequest";
import { useGetPaymentRequests } from "./hooks/useGetPaymentRequests";
import { useCancelPaymentRequest } from "./hooks/useCancelPaymentRequest";

interface AddToWalletModalProps {}

const BalanceModal: React.FC<AddToWalletModalProps> = ({}) => {
  const [opened, setOpened] = useState(false);
  const { userDocument } = useUser();
  const balance = userDocument?.balance;
  const usedBalance = userDocument?.usedBalance;
  //   const [amountToAdd, setAmountToAdd] = useState(0)
  const [activeTab, setActiveTab] = useState<string | null>("balance");

  const [value, setValue] = useState(0);
  const [request, setRequest] = useState((balance - usedBalance) | 0);
  const handlers = useRef<NumberInputHandlers>();
  const requestHandlers = useRef<NumberInputHandlers>();
  const {
    mutate: createLocalCardTransaction,
    isLoading,
    isError,
    isSuccess,
    data,
    isIdle,
  } = useCreateLocalCardTransactionForWallet();
  const {
    data: paymentRequests,
    isLoading: arePaymentRequestLoading,
    fetchNextPage,
  } = useGetPaymentRequests({ enabled: activeTab === "paymentRequests" });
  const { mutate: createPaymentRequest } = useCreatePaymentRequest();
  const { mutate: cancelPaymentRequest } = useCancelPaymentRequest();
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
          url: `${
            import.meta.env.VITE_APP_BASE_URL
          }/validateLocalCardTransaction`,
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
        <Tabs
          defaultValue="balance"
          value={activeTab}
          onTabChange={setActiveTab}
        >
          <Tabs.List>
            <Tabs.Tab value="balance">{t("Balance")}</Tabs.Tab>
            <Tabs.Tab value="paymentRequest">{t("Payment request")}</Tabs.Tab>
            <Tabs.Tab value="paymentRequests">{t("Payment requests")}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="balance">
            <Center m={"md"}>
              <Group grow>
                <TextInput
                  variant="unstyled"
                  value={` ${currencies[userDocument?.country]} ${balance}`}
                  readOnly
                  label={t("Balance")}
                />
                <TextInput
                  variant="unstyled"
                  readOnly
                  label={t("Used balance")}
                  value={` ${currencies[userDocument?.country]} ${usedBalance}`}
                />
                <TextInput
                  variant="unstyled"
                  readOnly
                  label={t("Availabe Balance")}
                  value={` ${currencies[userDocument?.country]} ${
                    balance - usedBalance
                  }`}
                />
              </Group>
            </Center>
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
                        ? `${
                            currencies[userDocument?.country]
                          } ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : `${currencies[userDocument?.country]} `
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
          </Tabs.Panel>

          <Tabs.Panel value="paymentRequest">
            <Center m={"md"}>
              <Group grow>
                <TextInput
                  variant="unstyled"
                  value={` ${currencies[userDocument?.country]} ${balance}`}
                  readOnly
                  label={t("Balance")}
                />
                <TextInput
                  variant="unstyled"
                  readOnly
                  label={t("Used balance")}
                  value={` ${currencies[userDocument?.country]} ${usedBalance}`}
                />
                <TextInput
                  variant="unstyled"
                  readOnly
                  label={t("Availabe Balance")}
                  value={` ${currencies[userDocument?.country]} ${
                    balance - usedBalance
                  }`}
                />
              </Group>
            </Center>
            <Center mt={24}>
              <Stack>
                <Group spacing={5}>
                  <ActionIcon
                    size={42}
                    variant="default"
                    onClick={() => requestHandlers.current.decrement()}
                  >
                    –
                  </ActionIcon>

                  <NumberInput
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    formatter={(value) =>
                      !Number.isNaN(parseFloat(value))
                        ? `${
                            currencies[userDocument?.country]
                          } ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : `${currencies[userDocument?.country]} `
                    }
                    hideControls
                    value={request}
                    onChange={(val) => setRequest(val)}
                    handlersRef={requestHandlers}
                    min={10}
                    step={5}
                    styles={{
                      input: { width: "fit-content", textAlign: "center" },
                    }}
                  />

                  <ActionIcon
                    size={42}
                    variant="default"
                    onClick={() => requestHandlers.current.increment()}
                  >
                    +
                  </ActionIcon>
                </Group>
                <Button
                  disabled={isLoading || paying}
                  onClick={() => {
                    // TODO add transaction before opening the payment gateway

                    createPaymentRequest({ amount: request });
                  }}
                >
                  {t("Request")}
                </Button>
              </Stack>
            </Center>
          </Tabs.Panel>
          {activeTab === "paymentRequests" && (
            <Tabs.Panel value="paymentRequests">
              <Stack mt={12}>
                {arePaymentRequestLoading ? (
                  <Loader />
                ) : (
                  paymentRequests.pages.map((page) => {
                    return page.map((paymentRequest) => {
                      return (
                        <Paper>
                          <Stack>
                            {paymentRequest.validated === true && (
                              <Group position="right">
                                <Badge>{t("Validated")}</Badge>
                              </Group>
                            )}
                            <TextInput
                              value={paymentRequest.amount}
                              label={t("Amount")}
                              readOnly
                              variant="unstyled"
                            />
                            {paymentRequest.validated === false && (
                              <Button
                                color="red"
                                fullWidth
                                onClick={() => {
                                  cancelPaymentRequest({
                                    requestId: paymentRequest._id.toString(),
                                  });
                                }}
                              >
                                {t("Cancel")}
                              </Button>
                            )}
                          </Stack>
                        </Paper>
                      );
                    });
                  })
                )}
                <Button
                  onClick={() => {
                    fetchNextPage({
                      pageParam:
                        paymentRequests.pages[paymentRequests.pages.length - 1][
                          paymentRequests.pages[
                            paymentRequests.pages.length - 1
                          ].length - 1
                        ]._id,
                    });
                  }}
                >
                  {t("Load more")}
                </Button>
              </Stack>
            </Tabs.Panel>
          )}
        </Tabs>
      </Modal>
      <Button variant="subtle" onClick={() => setOpened(true)}>
        {`${currencies[userDocument?.country || "Libya"]} ${balance || 0}`}
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

export default BalanceModal;
