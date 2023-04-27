import { useUser } from "contexts/userContext/User";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useCreateLocalCardTransactionForDeliveryOrder = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    async ({ orderId }: { orderId: string }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ orderId, customerId: userDocument._id }],

          url: `${
            import.meta.env.VITE_APP_BASE_URL
          }/createServiceFeeCardTransaction`,
        });

        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useCreateLocalCardTransactionForDeliveryOrder.ts:15 ~ error:",
          error
        );
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["transactions"]);
      },
    }
  );
};
