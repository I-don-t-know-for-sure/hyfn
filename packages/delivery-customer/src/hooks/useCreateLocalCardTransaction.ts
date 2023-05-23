import { useUser } from "contexts/userContext/User";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useCreateLocalCardTransaction = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    async ({ amount }: { amount: number }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ amount, customerId: userDocument.id }],

          url: `${
            import.meta.env.VITE_APP_BASE_URL
          }/createLocalCardTransaction`,
        });

        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useCreateLocalCardTransaction.ts:17 ~ error:",
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
