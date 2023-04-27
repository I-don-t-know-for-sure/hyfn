import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useSendOTP = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    async (paymentInfo: {
      customerPhone: string;
      birthYear: string;
      OTPSent: Dispatch<SetStateAction<boolean>>;
      amount: any;
    }) => {
      console.log(JSON.stringify([{ customerId: userId, ...paymentInfo }]));
      try {
        const { OTPSent, amount, ...rest } = paymentInfo;
        const res = await fetchUtil({
          reqData: [{ customerId: userDocument._id, amount: amount, ...rest }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/sendSadadOTP`,
        });
        OTPSent(true);
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    }
  );
};
