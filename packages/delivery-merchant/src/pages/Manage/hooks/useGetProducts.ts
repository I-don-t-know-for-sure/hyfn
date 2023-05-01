import { products } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { useInfiniteQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetProducts = ({ lastDocId, check, filterText }) => {
  const { userId, userDocument } = useUser();

  return useInfiniteQuery(
    [products, check],
    async ({ queryKey, pageParam }) => {
      return await fetchUtil({
        url: import.meta.env.VITE_APP_GETPRODUCTS,

        reqData: [userDocument?.storeDoc, pageParam, queryKey[1]],
      });
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      // enabled: !filterText,
    }
  );
};
