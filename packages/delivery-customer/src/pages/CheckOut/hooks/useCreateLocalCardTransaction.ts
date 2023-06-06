import { useUser } from "contexts/userContext/User";
import { useMutation, useQueryClient } from "react-query";
import { fetchApi } from "util/fetch";

export const useCreateLocalCardTransaction = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    async ({ amount }: { amount: number }) => {
      try {
        const result = await fetchApi({
          arg: [{ amount, customerId: userDocument.id }],

          url: `createTransaction`,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: useCreateLocalCardTransaction.ts:19 ~ error:",
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
