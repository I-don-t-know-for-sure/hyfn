import { Box, Button, Group, NumberInput, TextInput } from "@mantine/core";

import { t } from "util/i18nextFix";
import React, { useEffect, useState } from "react";
import { useIncreaseBalanceWithSadad } from "../hooks/payWithSadad/useCompletePaymentWithSadad";
import { useResendOTP } from "../hooks/payWithSadad/useResendOTP";
import { useSendOTP } from "../hooks/payWithSadad/useSendOTP";
import { useForm } from "@mantine/form";

interface PayWithSadadProps {
  serviceFee: any;
  balanceNumber: any;
}

const PayWithSadad: React.FC<PayWithSadadProps> = ({
  serviceFee,
  balanceNumber
}) => {
  const { mutate: makePaymentWithSadad } = useIncreaseBalanceWithSadad();
  const { mutate: sendOTP } = useSendOTP();
  const { mutate: resendOTP } = useResendOTP();
  const [otpSent, setOtpSent] = useState(false);

  const paymentForm = useForm({
    initialValues: {
      amountToBeAdded: serviceFee,
      OTP: "",
      customerPhone: "",
      birthYear: ""
    }
  });
  useEffect(() => {
    paymentForm.setFieldValue(
      "amountToBeAdded",
      balanceNumber ? +balanceNumber - serviceFee : serviceFee
    );
  }, [serviceFee]);

  return (
    <Box>
      <Box
        sx={(theme) => ({
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "baseline",
          [theme.fn.smallerThan("md")]: {
            marginTop: 12
          }
        })}>
        <Group grow m={"8px auto"}>
          <NumberInput
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, "")
                : "$ "
            }
            precision={2}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            {...paymentForm.getInputProps("amountToBeAdded")}
            // max={balanceNumber ? serviceFee - +balanceNumber : serviceFee}
            placeholder={t("edit if you want")}
            disabled
          />
        </Group>
        <Group grow sx={{}} m={"auto"}>
          <TextInput
            {...paymentForm.getInputProps("customerPhone")}
            placeholder={t("write the paying phone number")}
          />
          <TextInput
            {...paymentForm.getInputProps("birthYear")}
            placeholder={t("write your birth year")}
          />
        </Group>
        <Group grow mt={12}>
          <Button
            onClick={() => {
              otpSent
                ? resendOTP({ OTPSent: setOtpSent })
                : sendOTP({
                    customerPhone: paymentForm.values.customerPhone,
                    birthYear: paymentForm.values.birthYear,
                    OTPSent: setOtpSent,
                    amount: paymentForm.values.amountToBeAdded
                  });
            }}>
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
            marginTop: 12
          }
        })}>
        <TextInput
          {...paymentForm.getInputProps("OTP")}
          placeholder={t("write the OTP here")}
        />
        <Button
          onClick={() => {
            makePaymentWithSadad({
              OTP: paymentForm.values.OTP
            });
          }}>
          {t("Make payment")}
        </Button>
      </Group>
    </Box>
  );
};

export default PayWithSadad;
