import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { Dispatch, SetStateAction } from "react";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useSendOTP = () => {
  const { userDocument: user, refetch } = useUser();

  const id = randomId();
  return useMutation(
    async (paymentInfo: {
      amountToBeAdded: number;
      customerPhone: string;
      birthYear: string;
      OTPSent: Dispatch<SetStateAction<boolean>>;
    }) => {
      console.log(
        JSON.stringify([{ customerId: user.driverId, ...paymentInfo }])
      );
      try {
        const res = await fetchUtil({
          reqData: [{ customerId: user.driverId, ...paymentInfo }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/sendOTP`,
        });

        paymentInfo.OTPSent(true);
        refetch();
        return res;
      } catch (error) {
        console.error(error);
      }
    }
  );
};
