import { Box, Button, Group, NumberInput, Text, TextInput } from "hyfn-client";

import { monthlySubscriptionCost } from "hyfn-types";
import { t } from "utils/i18nextFix";
import React, { useEffect, useState } from "react";
import {
  useMakePayment,
  useResendOTP,
  useSendOTP,
} from "../hooks/useMakePayment";
import { useForm } from "@mantine/form";

interface PayWithSadadProps {}

const PayWithSadad: React.FC<PayWithSadadProps> = () => {
  const { mutate: makePaymentWithSadad } = useMakePayment();
  const { mutate: sendOTP } = useSendOTP();
  const { mutate: resendOTP } = useResendOTP();
  const [otpSent, setOtpSent] = useState(false);

  const paymentForm = useForm({
    initialValues: {
      numberOfMonths: 0,
      OTP: "",
      customerPhone: "",
      birthYear: "",
    },
  });
  //   useEffect(() => {
  //     paymentForm.setFieldValue('amountToBeAdded', balanceNumber ? +balanceNumber - serviceFee : serviceFee);
  //   }, [serviceFee]);

  return (
    <Box>
      <Group>
        <Text weight={700}>{t("Cost")}</Text> :
        <Text>
          {paymentForm.values.numberOfMonths * monthlySubscriptionCost}
        </Text>
      </Group>
      <Box
        sx={(theme) => ({
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "baseline",
          [theme.fn.smallerThan("md")]: {
            marginTop: 12,
          },
        })}
      >
        <Group grow mb={6}>
          <NumberInput
            label={t("Number of months you want to subscribe for")}
            required
            {...paymentForm.getInputProps("numberOfMonths")}
            placeholder={t("Number of months you want to subscribe for")}
          />
        </Group>
        <Group grow sx={{}} m={"auto"}>
          <TextInput
            label={t("write the paying phone number")}
            required
            {...paymentForm.getInputProps("customerPhone")}
            placeholder={t("write the paying phone number")}
          />
          <TextInput
            required
            label={t("write your birth year")}
            {...paymentForm.getInputProps("birthYear")}
            placeholder={t("write your birth year")}
          />
        </Group>
        <Group grow mt={12}>
          <Button
            // mb={12}
            onClick={() => {
              otpSent
                ? resendOTP()
                : sendOTP({
                    numberOfMonths: paymentForm.values.numberOfMonths,
                    customerPhone: paymentForm.values.customerPhone,
                    birthYear: paymentForm.values.birthYear,
                    OTPSent: setOtpSent,
                  });
            }}
          >
            {otpSent ? t("Resend OTP") : t("Send OTP")}
          </Button>
        </Group>
      </Box>
      <Group
        grow
        sx={(theme) => ({
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "baseline",
          [theme.fn.smallerThan("md")]: {
            marginTop: 12,
          },
        })}
      >
        <TextInput
          required
          {...paymentForm.getInputProps("OTP")}
          placeholder={t("write the OTP here")}
        />
        <Button
          onClick={() => {
            makePaymentWithSadad({
              OTP: paymentForm.values.OTP,
              numberOfMonths: paymentForm.values.numberOfMonths,
            });
          }}
        >
          {t("Make payment")}
        </Button>
      </Group>
    </Box>
  );
};

export default PayWithSadad;
