import { useMutation } from "react-query";
import { fetchApi } from "../utils/fetch";

export const useValidateTransaction = ({
  url,
  transactionId,
}: {
  url: string;
  transactionId: string;
}) => {
  return useMutation(async () => {
    try {
      const result = await fetchApi({ reqData: [{ transactionId }], url });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useValidateTransaction.ts:8 ~ returnuseMutation ~ error",
        error
      );
      throw new Error("problem");
    }
  });
};
