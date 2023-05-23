import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useCreateLocalCardTransactionForWallet = () => {
  const { userDocument } = useUser();
  return useMutation(async ({ amount }: { amount: number }) => {
    try {
      const transactionObject = await fetchUtil({
        reqData: [{ amount, userId: userDocument.id }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createLocalCardTransaction`,
      });
      return transactionObject;
    } catch (error) {
      throw error;
    }
  });
};
