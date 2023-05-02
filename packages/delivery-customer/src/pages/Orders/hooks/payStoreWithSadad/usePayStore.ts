import { randomId } from "@mantine/hooks";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const usePayStore = () => {
  const { userId, userDocument } = useUser();

  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ storeId, orderId }: { storeId: string; orderId: string }) => {
      const id = randomId();
      try {
        const result = await fetchUtil({
          reqData: [
            {
              storeId,
              orderId,
              country,
              customerId: userDocument?._id,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/payStoreWithSadad`,
        });

        return result;
      } catch (error) {
        console.log("🚀 ~ file: usePayStore.ts:33 ~ error:", error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    }
  );
};
