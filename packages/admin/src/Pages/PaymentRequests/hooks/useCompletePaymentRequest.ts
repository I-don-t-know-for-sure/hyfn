import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useCompletePaymentRequest = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ transactionId }],
        url: `completePaymentRequest`,
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  });
};
