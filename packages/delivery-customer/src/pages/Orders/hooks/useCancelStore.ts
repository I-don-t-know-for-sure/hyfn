import { randomId } from "@mantine/hooks";

import { useLocation } from "../../../contexts/locationContext/LocationContext";

import { t } from "../../../util/i18nextFix";

import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";

import { fetchApi } from "util/fetch";

export const useCancelStore = () => {
  const [{ country }] = useLocation();

  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    ["cancelOrder"],
    async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
      try {
        const result = await fetchApi({
          arg: [{ country, orderId, storeId }],
          url: `cancelOrder`,
        });

        return result;
      } catch (error) {
        console.log("🚀 ~ file: useCancelStore.ts:27 ~ error:", error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["activeOrders"]);
      },
    }
  );
};
