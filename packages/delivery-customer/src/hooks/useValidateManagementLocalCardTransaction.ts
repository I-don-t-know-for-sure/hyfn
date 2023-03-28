import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useValidateManagementLocalCardTransaction = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ transactionId }],
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/validateManagmentLocalCardTransaction`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useValidateManagementTransaction.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
