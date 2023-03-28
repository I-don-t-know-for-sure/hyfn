import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useCancelTransaction = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ transactionId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/cancelTransaction`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useCancelTransaction.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
