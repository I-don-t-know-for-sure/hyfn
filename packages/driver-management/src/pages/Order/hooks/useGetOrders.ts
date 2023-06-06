import { useInfiniteQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetOrders = ({
  type,
  active,
}: {
  active: boolean;

  type: string;
}) => {
  return useInfiniteQuery(["getActiveOrders"], async ({ pageParam }) => {
    try {
      const result = await fetchApi({
        arg: [{ type, lastDoc: pageParam, active }],
        url: `getActiveOrders`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useGetActiveOrders.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
