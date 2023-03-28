import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useCreatePaymentRequest = () => {
  return useMutation(async ({ amount }: { amount: number }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ amount }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createPaymentRequest`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useCreatePaymentRequest.ts:8 ~ returnuseMutation ~ error",
        error
      );
    }
  });
};
