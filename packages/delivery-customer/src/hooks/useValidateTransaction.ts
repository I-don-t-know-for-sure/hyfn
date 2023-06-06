import { useMutation } from "react-query";
import { fetchApi } from "util/fetch";

export const useValidateTransaction = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ transactionId }],
        url: `validateTransaction`,
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
