import { useUser } from "contexts/userContext/User";
import { useInfiniteQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useGetProducts = ({ lastDocId, check }) => {
  const { userId, userDocument } = useUser();

  return useInfiniteQuery(
    ["products", check],
    async ({ queryKey, pageParam }) => {
      console.log(
        "🚀 ~ file: useGetProductsForBulkUpdate.ts:13 ~ pageParam:",
        pageParam
      );
      return await fetchApi({
        url: `getProducts`,

        arg: [{ storeId: userDocument?.id, lastDoc: pageParam, filter: check }]
      });
    },
    {
      keepPreviousData: true
      // getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      // enabled: !filterText,
    }
  );
};
