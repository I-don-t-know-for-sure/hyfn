import { products } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { useInfiniteQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useGetProducts = ({ lastDocId, check, filterText }) => {
  const { userId, userDocument } = useUser();

  return useInfiniteQuery(
    [products, check],
    async ({ queryKey, pageParam }) => {
      console.log(
        "🚀 ~ file: useGetProductsForBulkUpdate.ts:13 ~ pageParam:",
        pageParam
      );
      return await fetchApi({
        url: `getProducts`,

        arg: [userDocument?.id, pageParam, queryKey[1]],
      });
    },
    {
      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      // enabled: !filterText,
    }
  );
};
