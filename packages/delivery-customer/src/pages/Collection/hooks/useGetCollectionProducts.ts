import { COLLECTION } from "hyfn-types";
import { useInfiniteQuery, useQuery } from "react-query";

import { fetchApi } from "../../../util/fetch";

export const useGetCollectionProducts = ({
  collectionid,
  country,
  storefront,
  documents,
  isOnScreen,
}: {
  documents?: number;
  country: string;
  storefront: string;
  collectionid: string;
  isOnScreen?: boolean;
}) => {
  console.log("query running ffffffffffffffffffffffffffffffffffffffff");

  return useInfiniteQuery(
    [COLLECTION, collectionid],
    async ({ pageParam = 0 }) => {
      console.log(
        // JSON.stringify([{ country, storefront, collectionid }, chunck])
        pageParam
      );
      console.log(pageParam);

      const result = await fetchApi({
        arg: [
          {
            country,
            storefront,
            collectionid,
            documents,
            lastDocNumber: pageParam,
          },
        ],
        url: `getCollectionProducts`,
      });
      return result;
    },
    {
      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      enabled: isOnScreen,
      staleTime: 300000,
    }
  );
};
