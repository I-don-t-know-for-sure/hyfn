import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";

export const useUpdatePaymentSettings = () => {
  const { userDocument, userId } = useUser();

  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      const random = randomId();
      try {
        const storeDoc = userDocument?.storeDoc as { id: string };
        await fetchUtil({
          reqData: [{ storeId: userDocument._id, userId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/updatePaymentSettings`,
        });
      } catch (error) {
        const { message } = error as { message: string };
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries([
          "storeInfo",
          userDocument?.storeDoc?.id,
        ]);
      },
    }
  );
};
