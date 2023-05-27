import { allProductsForCollection } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetProductsForCollection = ({
  collectionId,
  checked,
}: {
  collectionId: string;
  checked: boolean;
}) => {
  const { userId, userDocument } = useUser();

  return useInfiniteQuery(
    [allProductsForCollection, collectionId],
    async ({ pageParam = 0 }) => {
      try {
        const result = await fetchUtil({
          reqData: [
            {
              storeId: userDocument.id,
              lastDocNumber: pageParam,
              collectionId,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getProductsForCollection`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useGetProductsForCollection.ts:37 ~ error:",
          error
        );
        throw new Error("error");
      }
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      enabled: !!checked,
    }
  );
};
