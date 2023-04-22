import { useInfiniteQuery } from "react-query";
import fetchUtil from "utils/fetch";

export const useGetOrders = ({
  type,
  active,
}: {
  active: boolean;

  type: string;
}) => {
  return useInfiniteQuery(["getActiveOrders"], async ({ pageParam }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ type, lastDoc: pageParam, active }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getActiveOrders`,
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
