import { useUser } from "contexts/userContext/User";
import { useInfiniteQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetProducts = ({ lastDocId, check, filterText }) => {
  const { userDocument } = useUser();

  return useInfiniteQuery(
    ["products", check],
    async ({ queryKey, pageParam }) => {
      return await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/getProducts`,

        reqData: [{ creatorId: userDocument._id, lastProductId: pageParam }],
      });
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      // enabled: !filterText,
    }
  );
};