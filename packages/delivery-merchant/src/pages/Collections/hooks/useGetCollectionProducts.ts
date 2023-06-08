import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useGetCollectionProducts = ({
  collectionId,
  checked,
}: {
  collectionId: string;
  checked: boolean;
}) => {
  const { userId, userDocument } = useUser();

  return useInfiniteQuery(
    ["collectionProducts", collectionId],
    async ({ pageParam }) => {
      try {
        const result = await fetchApi({
          arg: [
            {
              storeId: userDocument.id,
              lastDoc: pageParam,
              collectionId,
            },
          ],
          url: `getCollectionProducts`,
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
