import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "react-query";

import { fetchApi } from "util/fetch";

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
      // try {
      //   const { OTPSent, amount, ...rest } = paymentInfo;
      //   const res = await fetchApi({
      //     arg: [{ customerId: userDocument.id, amount: amount, ...rest }],
      //     url: `sendSadadOTP`,
      //   });
      //   OTPSent(true);
      //   return res;
      // } catch (error) {
      //   console.error(error);
      // }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    }
  );
};
