import { useUser } from "contexts/userContext/User";
import { useInfiniteQuery } from "react-query";

import { fetchApi } from "util/fetch";

export const useGetTransactions = ({ enabled }: { enabled: boolean }) => {
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useInfiniteQuery(
    ["transactions"],
    async ({ pageParam }) => {
      console.log(pageParam);

      return fetchApi({
        arg: [{ customerId: userDocument.id, lastDoc: pageParam }],
        url: `getTransactions`,
      });
    },
    {
      enabled: enabled,
      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    }
  );
};
