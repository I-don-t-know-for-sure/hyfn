import { transactions } from "config/constants";
import { useUser } from "contexts/userContext/User";
import { useInfiniteQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetTransactions = ({ enabled }: { enabled: boolean }) => {
  const { userId, userDocument } = useUser();

  return useInfiniteQuery(
    [transactions],
    async ({ pageParam }) => {
      console.log(pageParam);

      return await fetchUtil({
        reqData: [{ userId: userDocument._id, lastDoc: pageParam }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getTransactionsList`,
      });
    },
    {
      enabled: enabled,
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    }
  );
};
