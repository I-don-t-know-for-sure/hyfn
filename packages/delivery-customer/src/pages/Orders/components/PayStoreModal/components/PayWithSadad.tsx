import { Box, Button, Group, NumberInput, TextInput } from "hyfn-client";
import { useForm } from "@mantine/form";

import { t } from "util/i18nextFix";
import { usePayStore } from "pages/Orders/hooks/payStoreWithSadad/usePayStore";
import { useSendOTP } from "pages/Orders/hooks/payStoreWithSadad/useSendOTP";
import React, { useState } from "react";

interface PayWithSadadProps {
  storeId: string;
  orderId: string;
}

const PayWithSadad: React.FC<PayWithSadadProps> = ({ storeId, orderId }) => {
  const paymentForm = useForm({
    initialValues: {
      amountToBeAdded: 0,
      OTP: "",
      customerPhone: "",
      birthYear: "",
    },
  });
  const { mutate } = useSendOTP();
  const [otpSent, setOtpSent] = useState(false);
  const { mutate: payStoreWithSadad } = usePayStore();

  //   useEffect(() => {
  //     paymentForm.setFieldValue(
  //       "amountToBeAdded",
  //       balanceNumber ? serviceFee - +balanceNumber : serviceFee
  //     );
  //   }, [serviceFee]);
  return (
    <Box>
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
            // max={
            //   balanceNumber ? serviceFee - +balanceNumber : serviceFee
            // }
            placeholder={t("edit if you want")}
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
              mutate({ storeId, orderId });
            }}
            // onClick={() => {
            //   otpSent
            //     ? resendOTP()
            //     : sendOTP({
            //         amountToBeAdded:
            //           paymentForm.values.amountToBeAdded,
            //         customerPhone: paymentForm.values.customerPhone,
            //         birthYear: paymentForm.values.birthYear,
            //         OTPSent: setOtpSent,
            //       });
            // }}
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
          marginTop: 12,
          [theme.fn.smallerThan("md")]: {},
        })}
      >
        <TextInput
          {...paymentForm.getInputProps("OTP")}
          placeholder={t("write the OTP here")}
        />
        <Button
          onClick={() => {
            console.log("ehllo");

            payStoreWithSadad({ storeId, orderId });
          }}
        >
          {t("Make payment")}
        </Button>
      </Group>
    </Box>
  );
};

export default PayWithSadad;
