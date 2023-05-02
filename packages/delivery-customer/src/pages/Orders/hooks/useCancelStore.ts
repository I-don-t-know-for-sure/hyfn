import { randomId } from "@mantine/hooks";

import { useLocation } from "../../../contexts/locationContext/LocationContext";

import { t } from "../../../util/i18nextFix";

import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useCancelStore = () => {
  const [{ country }] = useLocation();

  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    ["cancelOrder"],
    async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ country, orderId, storeId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/cancelStore`,
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
