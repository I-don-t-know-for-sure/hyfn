import { useUser } from "contexts/userContext/User";
import { useInfiniteQuery } from "react-query";

import fetchUtil from "util/fetch";

export const useGetTransactions = ({ enabled }: { enabled: boolean }) => {
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useInfiniteQuery(
    ["transactions"],
    async ({ pageParam }) => {
      console.log(pageParam);

      return fetchUtil({
        reqData: [{ customerId: userDocument.id, lastDoc: pageParam }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getTransactions`,
      });
    },
    {
      enabled: enabled,
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    }
  );
};
