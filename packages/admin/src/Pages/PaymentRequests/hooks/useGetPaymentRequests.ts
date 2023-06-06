import { useInfiniteQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetPaymentRequests = () => {
  return useInfiniteQuery([], async ({ pageParam }) => {
    try {
      const result = await fetchApi({
        arg: [{ lastDoc: pageParam }],
        url: `getPaymentRequests`,
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
