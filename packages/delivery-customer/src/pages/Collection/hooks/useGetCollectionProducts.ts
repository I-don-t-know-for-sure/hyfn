import { COLLECTION } from "../../../config/constents";
import { useInfiniteQuery, useQuery } from "react-query";

import fetchUtil from "../../../util/fetch";

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
    async ({ pageParam = "" }) => {
      console.log(
        // JSON.stringify([{ country, storefront, collectionid }, chunck])
        pageParam
      );
      console.log(pageParam);

      const result = await fetchUtil({
        reqData: [{ country, storefront, collectionid, documents }, pageParam],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getCollectionProducts`,
      });
      return result;
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      enabled: isOnScreen,
      staleTime: 300000,
    }
  );
};
