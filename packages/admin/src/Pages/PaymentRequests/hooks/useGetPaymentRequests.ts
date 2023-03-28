import { useInfiniteQuery } from "react-query";
import fetchUtil from "utils/fetch";

export const useGetPaymentRequests = () => {
  return useInfiniteQuery([], async ({ pageParam }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ lastDoc: pageParam }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getPaymentRequests`,
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
