import { useUser } from "contexts/userContext/User";
import { useInfiniteQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useGetStoreDrivers = () => {
  const { userId, userDocument } = useUser();
  console.log(
    "🚀 ~ file: useGetStoreDrivers.ts:9 ~ useGetStoreDrivers ~ userDocument",
    userDocument
  );

  return useInfiniteQuery(
    ["trustedDrivers"],
    async ({ pageParam }) => {
      return fetchApi({
        arg: [
          {
            storeId: userDocument?.id,
            lastDoc: pageParam,
            management: "stores",
          },
        ],

        url: `getTrustedDrivers`,
      });
    },
    {
      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage?.nextCursor as any,
    }
  );
};
