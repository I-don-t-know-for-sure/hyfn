import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useCreateLocalCardTransactionForWallet = () => {
  const { userDocument } = useUser();
  return useMutation(async ({ amount }: { amount: number }) => {
    try {
      const transactionObject = await fetchApi({
        arg: [{ amount, userId: userDocument.id, management: "stores" }],
        url: `createTransaction`,
      });
      return transactionObject;
    } catch (error) {
      throw error;
    }
  });
};
