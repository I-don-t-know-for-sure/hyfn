import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useGetProductsForCollection = ({
  collectionId,
  checked,
}: {
  collectionId: string;
  checked: boolean;
}) => {
  const { userId, userDocument } = useUser();

  return useInfiniteQuery(
    ["allProductsForCollection", collectionId],
    async ({ pageParam = 0 }) => {
      try {
        const result = await fetchApi({
          arg: [
            {
              storeId: userDocument.id,
              lastDocNumber: pageParam,
              collectionId,
            },
          ],
          url: `getProductsForCollection`,
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
      // getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      enabled: !!checked,
    }
  );
};
