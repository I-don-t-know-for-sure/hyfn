import { useInfiniteQuery, useQuery } from "react-query";

import { fetchApi } from "../../../util/fetch";

export const useGetCollectionProducts = ({
  collectionid,
  // country,
  storeId,
  enabled,
  documents,
  isOnScreen
}: {
  documents?: number;
  // country: string;
  storeId: string;

  collectionid: string;
  isOnScreen?: boolean;
  enabled?: boolean;
}) => {
  console.log("query running ffffffffffffffffffffffffffffffffffffffff");

  return useInfiniteQuery(
    [collectionid],
    async ({ pageParam = 0 }) => {
      console.log(
        // JSON.stringify([{ country, storefront, collectionid }, chunck])
        pageParam
      );
      console.log(pageParam);

      const result = await fetchApi({
        arg: [
          {
            // country,
            storeId,

            collectionid,
            documents,
            lastDocNumber: pageParam
          }
        ],
        url: `getCollectionProducts`
      });
      return result;
    },
    {
      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      enabled: enabled,
      staleTime: 300000
    }
  );
};
