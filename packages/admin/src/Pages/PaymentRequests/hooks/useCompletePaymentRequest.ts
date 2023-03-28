import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useCompletePaymentRequest = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ transactionId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/completePaymentRequest`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useCompletePaymentRequest.ts:8 ~ returnuseMutation ~ error",
        error
      );
    }
  });
};
