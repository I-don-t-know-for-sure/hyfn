import { useMutation } from "react-query";
import { fetchApi } from "util/fetch";

export const useCancelTransaction = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ transactionId }],
        url: `cancelTransaction`,
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
