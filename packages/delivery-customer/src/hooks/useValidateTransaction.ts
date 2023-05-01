import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useValidateTransaction = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ transactionId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/validateTransaction`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useValidateTransaction.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
