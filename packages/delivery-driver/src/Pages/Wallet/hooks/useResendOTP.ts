import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { Dispatch, SetStateAction } from "react";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useResendOTP = () => {
  const { userDocument: user, refetch } = useUser();

  const id = randomId();
  return useMutation(async () => {
    try {
      const res = await fetchUtil({
        reqData: [{ customerId: user.driverId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/resendOTP`,
        user,
      });

      refetch();
      return res;
    } catch (error) {
      console.error(error);
    }
  });
};
