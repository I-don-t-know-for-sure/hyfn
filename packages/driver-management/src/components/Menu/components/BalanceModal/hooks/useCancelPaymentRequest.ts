import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useCancelPaymentRequest = () => {
  return useMutation(async ({ requestId }: { requestId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ requestId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/cancelPaymentRequest`,
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
