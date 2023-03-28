import { useInfiniteQuery, useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useCreatePaymentRequestObject = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ transactionId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createPaymentRequestObject`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useGetPaymentRequests.ts:8 ~ returnuseInfiniteQuery ~ error",
        error
      );
    }
  });
};
