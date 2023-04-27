import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useValidateLocalCardTransaction = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ transactionId }],

        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/validateLocalCardTransaction`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useValidateLocalCardTransaction.ts:10 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
