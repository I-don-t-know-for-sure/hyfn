import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { Dispatch, SetStateAction } from "react";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useMakePayment = () => {
  const { userDocument } = useUser();
  const id = randomId();
  return useMutation(
    async ({
      numberOfMonths,
      OTP,
    }: {
      OTP: string;
      numberOfMonths: number;
    }) => {
      try {
        const res = await fetchUtil({
          reqData: [{ storeId: userDocument._id, OTP, numberOfMonths }],
          url: import.meta.env.VITE_APP_MAKEPAYMENT,
        });
        return res;
      } catch (e) {
        console.error(e);
      }
    }
  );
};

export const useSendOTP = () => {
  const { userId } = useUser();
  const id = randomId();
  return useMutation(
    async (paymentInfo: {
      numberOfMonths: number;
      customerPhone: string;
      birthYear: string;
      OTPSent: Dispatch<SetStateAction<boolean>>;
    }) => {
      try {
        const res = await fetchUtil({
          reqData: [{ customerId: userId, ...paymentInfo }],
          url: import.meta.env.VITE_APP_SENDOTP,
        });
        paymentInfo.OTPSent(true);
        return res;
      } catch (error) {
        console.error(error);
      }
    }
  );
};

export const useResendOTP = () => {
  const { userId } = useUser();

  const id = randomId();
  return useMutation(async () => {
    try {
      const res = await fetchUtil({
        reqData: [{ customerId: userId }],
        url: import.meta.env.VITE_APP_RESENDOTP,
      });

      return res;
    } catch (error) {
      console.error(error);
    }
  });
};
