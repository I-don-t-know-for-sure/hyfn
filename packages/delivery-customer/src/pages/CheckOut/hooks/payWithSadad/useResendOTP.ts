import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";
import { Dispatch, SetStateAction } from "react";

import { useMutation } from "react-query";

import fetchUtil from "util/fetch";

export const useResendOTP = () => {
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    async ({ OTPSent }: { OTPSent: Dispatch<SetStateAction<boolean>> }) => {
      try {
        const res = await fetchUtil({
          reqData: [{ customerId: userId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/resendSadadOTP`,
        });
        return res;
      } catch (error) {
        OTPSent(false);
        console.error(error);
      }
    }
  );
};
