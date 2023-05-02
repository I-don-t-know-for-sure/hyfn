import { collectionProducts } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetCollectionProducts = ({
  collectionId,
  checked,
}: {
  collectionId: string;
  checked: boolean;
}) => {
  const { userId, userDocument } = useUser();

  return useInfiniteQuery(
    [collectionProducts, collectionId],
    async ({ pageParam }) => {
      try {
        const { country } = userDocument.storeDoc as { country: string };
        const result = await fetchUtil({
          reqData: [
            {
              country,
              storeId: userDocument._id,
              lastDoc: pageParam,
              collectionId,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getCollectionProducts`,
        });
        console.log(result);

        return result;
      } catch (error) {
        console.log(error);
      }
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      enabled: !!(collectionId && checked),
    }
  );
};
