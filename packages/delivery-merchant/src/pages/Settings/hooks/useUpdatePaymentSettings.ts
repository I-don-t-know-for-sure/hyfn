import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "react-query";

import { fetchApi } from "utils/fetch";

export const useUpdatePaymentSettings = () => {
  const { userDocument, userId } = useUser();

  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      const random = randomId();
      try {
        const storeDoc = userDocument?.storeDoc as { id: string };
        await fetchApi({
          arg: [{ storeId: userDocument.id, userId }],
          url: `updatePaymentSettings`,
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
