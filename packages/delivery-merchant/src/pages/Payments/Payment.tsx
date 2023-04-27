import {
  ActionIcon,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Group,
  Loader,
  NumberInput,
  NumberInputHandlers,
  Overlay,
  Select,
  SelectItemProps,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { paymentMethods } from "config/data";

import { t } from "utils/i18nextFix";
import useGetStoreInfo from "hooks/useGetStoreInfo";
import React, { forwardRef, useEffect, useRef, useState } from "react";
// import { Helmet } from 'react-helmet-async'
import { useDeleteSadadAPIKey } from "./hooks/useDeleteSadadKey";
import {
  useMakePayment,
  useResendOTP,
  useSendOTP,
} from "./hooks/useMakePayment";
import { useUpdatePaymentSettings } from "./hooks/useUpdatePaymentSettings";
import useUpdateStoreOwnerInfo from "./hooks/useUpdateStoreOwnerInfo";

import LocalCardAPIKey from "./components/LocalCardAPIKey";
import { useDeleteLocalCardAPIKey } from "./hooks/useDeleteLocalCardAPIkey";
import { useAddLocalCardAPIKeys } from "./hooks/useAddLocalCardAPIKey";
import PayWithSadad from "./components/PayWithSadad";
import { PayWithLocalCard } from "./components/PayWithLocalCard";
import TransactionList from "components/TransactionList";
import { useForm } from "@mantine/form";
import { useDisableLocalCardKeys } from "./hooks/useDisableLocalCardKeys";
import { useUpdateLocalCardSettings } from "./hooks/useUpdateLocalCardSettings";
import PaymentModal from "./components/PaymentModal";
import { useUpdateSubscription } from "./hooks/useUpdateSubscription";
import { useAddEmployee } from "./hooks/useAddEmployee";

interface PaymentsProps {}

// store owner fills their info here and make the monthly payments
// and in the future makes request to get thier money

const Payments: React.FC<PaymentsProps> = () => {
  const { data, isLoading } = useGetStoreInfo();
  console.log("🚀 ~ file: Payment.tsx:54 ~ data", data);
  const [value, setValue] = useState<number>(0);
  const handlers = useRef<NumberInputHandlers>();

  const { mutate: disableLocalCardKeys } = useDisableLocalCardKeys();
  const { mutate: deleteLocalCardAPIKey } = useDeleteLocalCardAPIKey();
  const { mutate: addLocalCardAPIkey } = useAddLocalCardAPIKeys();
  const { mutate: updateLocalCardSetting } = useUpdateLocalCardSettings();
  const { mutate: updateSubscription } = useUpdateSubscription();
  const { mutate: addEmployee } = useAddEmployee();
  const [employeeId, setEmployeeId] = useState<string>("");
  const form = useForm({
    initialValues: {
      ownerFirstName: "",
      ownerLastName: "",
      ownerPhoneNumber: "",

      sadadFilled: false,
      sadadApiKey: "",
      MerchantId: "",
      TerminalId: "",
      secretKey: "",
      LocalCardPAIKeyFilled: false,
      includeLocalCardFeeToPrice: false,
    },
  });
  useEffect(() => {
    if (data?.ownerFirstName) {
      form.setValues({
        ownerFirstName: data.ownerFirstName,
        ownerLastName: data.ownerLastName,
        ownerPhoneNumber: data.ownerPhoneNumber,

        sadadFilled: data?.sadadFilled,
        sadadApiKey: data?.sadadApiKey,
        MerchantId: data?.localCardAPIKey?.MerchantId,
        TerminalId: data?.localCardAPIKey?.TerminalId,
        secretKey: data?.localCardAPIKey?.secretKey,
        includeLocalCardFeeToPrice: data?.includeLocalCardFeeToPrice,
        LocalCardPAIKeyFilled: data?.localCardAPIKeyFilled,
      });
    }
  }, [data, isLoading]);
  console.log(form.values.MerchantId);

  const paymentForm = useForm({
    initialValues: {
      numberOfMonths: 0,
      OTP: "",
      customerPhone: "",
      birthYear: "",
    },
  });

  // create a function that converts a string date to normal date
  const convertDate = (date: string) => {
    const newDate = new Date(date);
    return `${newDate.getFullYear()}-${
      newDate.getMonth() + 1
    }-${newDate.getDate()} `;
  };

  const { mutate } = useUpdateStoreOwnerInfo();
  return (
    <Container mt={6}>
      {/* <Helmet>
        <title>{t(isLoading ? 'Loading' : 'Payment Settings')}</title>
      </Helmet> */}
      {isLoading ? (
        <Loader />
      ) : (
        data && (
          <Stack>
            <Card title={t("Owner Info")}>
              <Text size="md" weight={500}>
                {t("Owner Info")}
              </Text>
              <form
                onSubmit={form.onSubmit((values) => {
                  mutate({ ...values, storeOwnerInfoFilled: true });
                })}
              >
                <Group grow>
                  <TextInput
                    required
                    label={t("first name")}
                    {...form.getInputProps("ownerFirstName")}
                  />
                  <TextInput
                    required
                    label={t("last name")}
                    {...form.getInputProps("ownerLastName")}
                  />
                </Group>
                <TextInput
                  required
                  label={t("phone number")}
                  {...form.getInputProps("ownerPhoneNumber")}
                />
                {/* {form.values.sadadFilled ? (
                  <>
                    <Group position="apart">
                      <Text mt={12}>{t('Sadad API key')}</Text>
                      <Button compact color={'red'} onClick={() => deleteSadadAPIKey()}>
                        {t('Delete')}
                      </Button>
                    </Group>
                    <Skeleton m={'4px auto'} animate={false} height={35} width={'100%'}></Skeleton>
                  </>
                ) : (
                  <TextInput label={t('Sadad API key')} {...form.getInputProps('sadadApiKey')} />
                )} */}
                <Container
                  mt={14}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    // m={'0px auto'}
                    fullWidth
                    // sx={{
                    //   maxWidth: '450px',
                    // }}
                    type="submit"
                  >
                    {t("update")}
                  </Button>
                </Container>
              </form>
            </Card>

            <LocalCardAPIKey
              MerchantId={form.values.MerchantId}
              TerminalId={form.values.TerminalId}
              localCardAPIKeyFilled={form.values.LocalCardPAIKeyFilled}
              secretKey={form.values.secretKey}
              includeLocalCardFeeToPrice={
                form.values.includeLocalCardFeeToPrice
              }
              addLocalCardAPIkey={addLocalCardAPIkey}
              deleteLocalCardAPIKey={deleteLocalCardAPIKey}
              disableLocalCardAPIKeys={disableLocalCardKeys}
              updateLocalCardSetting={updateLocalCardSetting}
            />

            <Card
              // m={'12px auto'}
              title={t("Account Payments")}
              shadow={"md"}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Title order={3} mb={8}>
                  {t("Account Payments")}
                </Title>
                <PaymentModal balance={data?.balance} />
              </Box>

              <Stack align="center">
                <Group>
                  <Text>
                    {`${t("Started at")} ${
                      data?.subscriptionInfo?.timeOfPayment
                        ? convertDate(data?.subscriptionInfo?.timeOfPayment)
                        : Number.NaN
                    }`}
                  </Text>
                  <Text>
                    {`${t("Ends at")} ${
                      data?.subscriptionInfo?.expirationDate
                        ? convertDate(data?.subscriptionInfo?.expirationDate)
                        : Number.NaN
                    }`}
                  </Text>
                </Group>
                <Group spacing={5}>
                  <ActionIcon
                    size={42}
                    variant="default"
                    onClick={() => handlers.current.decrement()}
                  >
                    –
                  </ActionIcon>

                  <NumberInput
                    hideControls
                    value={value}
                    onChange={(val) => setValue(val)}
                    handlersRef={handlers}
                    // max={10}
                    min={1}
                    step={1}
                    styles={{ input: { width: 54, textAlign: "center" } }}
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
                  onClick={() => {
                    updateSubscription({ numberOfMonths: value });
                  }}
                >
                  {t("Update subscription")}
                </Button>
              </Stack>
            </Card>
            <Card>
              <Stack>
                <TextInput
                  label={t("Add employee")}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
                <Button
                  onClick={() => {
                    addEmployee({ employeeId });
                  }}
                >
                  {t("Add employee")}
                </Button>
              </Stack>
            </Card>
          </Stack>
        )
      )}
    </Container>
  );
};

export default Payments;
