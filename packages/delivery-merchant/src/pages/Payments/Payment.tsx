import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Group,
  Loader,
  NumberInput,
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
import React, { forwardRef, useEffect, useState } from "react";
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

interface PaymentsProps {}

// store owner fills their info here and make the monthly payments
// and in the future makes request to get thier money

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

const Payments: React.FC<PaymentsProps> = () => {
  const { data, isLoading } = useGetStoreInfo();
  console.log("🚀 ~ file: Payment.tsx:54 ~ data", data);
  const { mutate: updatePaymentSettings } = useUpdatePaymentSettings();
  const { mutate: deleteSadadAPIKey } = useDeleteSadadAPIKey();
  const { mutate: disableLocalCardKeys } = useDisableLocalCardKeys();
  const { mutate: deleteLocalCardAPIKey } = useDeleteLocalCardAPIKey();
  const { mutate: addLocalCardAPIkey } = useAddLocalCardAPIKeys();
  const { mutate: updateLocalCardSetting } = useUpdateLocalCardSettings();
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);
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
              {/* <Overlay opacity={0.6} color="#000" zIndex={55} /> */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Title order={3} mb={8}>
                  {t("Account Payments")}
                </Title>
                <TransactionList />
              </Box>
              <Group
                grow
                sx={(theme) => ({
                  [theme.fn.smallerThan("md")]: {
                    flexDirection: "column-reverse",
                  },
                  display: "flex",
                  justifyContent: "space-between",
                })}
              >
                {/* <Box>
                  <Box
                    sx={(theme) => ({
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      [theme.fn.smallerThan('md')]: {
                        marginTop: 12,
                      },
                    })}
                  >
                    <Group grow mb={6}>
                      <NumberInput
                        required
                        {...paymentForm.getInputProps('numberOfMonths')}
                        placeholder={t('Number of months you want to subscribe for')}
                      />
                    </Group>
                    <Group grow sx={{}} m={'auto'}>
                      <TextInput
                        required
                        {...paymentForm.getInputProps('customerPhone')}
                        placeholder={t('write the paying phone number')}
                      />
                      <TextInput
                        required
                        {...paymentForm.getInputProps('birthYear')}
                        placeholder={t('write your birth year')}
                      />
                    </Group>
                    <Group grow mt={12}>
                      <Button
                        mb={12}
                        onClick={() => {
                          otpSent
                            ? resendOTP()
                            : sendOTP({
                                numberOfMonths: paymentForm.values.numberOfMonths,
                                customerPhone: paymentForm.values.customerPhone,
                                birthYear: paymentForm.values.birthYear,
                                OTPSent: setOtpSent,
                              })
                        }}
                      >
                        {otpSent ? t('Resend OTP') : t('Send OTP')}
                      </Button>
                    </Group>
                  </Box>
                  <Group
                    grow
                    sx={(theme) => ({
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      [theme.fn.smallerThan('md')]: {
                        marginTop: 12,
                      },
                    })}
                  >
                    <TextInput required {...paymentForm.getInputProps('OTP')} placeholder={t('write the OTP here')} />
                    <Button
                      onClick={() => {
                        makePayment({
                          OTP: paymentForm.values.OTP,
                          numberOfMonths: paymentForm.values.numberOfMonths,
                        })
                      }}
                    >
                      {t('Make payment')}
                    </Button>
                  </Group>

                </Box> */}
                {/* {paymentMethods[0].value === paymentMethod && <PayWithSadad />} */}
                {paymentMethods[0].value === paymentMethod && (
                  <PayWithLocalCard />
                )}

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
            </Card>
          </Stack>
        )
      )}
    </Container>
  );
};

export default Payments;
