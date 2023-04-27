import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";

import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useIncreaseBalanceWithSadad = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    async ({ OTP }: { OTP: string }) => {
      try {
        console.log(JSON.stringify([{ customerId: userId, OTP }]));

        const res = await fetchUtil({
          reqData: [{ customerId: userId, OTP }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/payWithSadad`,
        });
        return res;
      } catch (e) {
        console.error(e);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    }
  );
};
