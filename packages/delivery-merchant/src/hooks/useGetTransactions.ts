import { transactions } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { useInfiniteQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useGetTransactions = ({ enabled }: { enabled: boolean }) => {
  const { userDocument } = useUser();

  return useInfiniteQuery(
    [transactions],
    async ({ pageParam }) => {
      console.log(pageParam);

      return await fetchApi({
        arg: [{ userId: userDocument.id, lastDoc: pageParam }],
        url: `getTransactionsList`,
      });
    },
    {
      enabled: enabled,
      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    }
  );
};
