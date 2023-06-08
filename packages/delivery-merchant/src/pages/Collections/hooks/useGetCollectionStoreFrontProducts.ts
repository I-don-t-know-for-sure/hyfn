import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useGetCollectionStoreFrontProducts = ({
  collectionId,
  checked,
}: {
  collectionId: string;
  checked: boolean;
}) => {
  const { userId, userDocument } = useUser();

  return useQuery(
    ["collectionStoreFrontProducts", collectionId],
    async () => {
      try {
        const { country } = userDocument.storeDoc as { country: string };

        const result = await fetchApi({
          arg: [
            {
              country,
              storeId: userDocument.id,

              collectionId,
            },
          ],
          url: import.meta.env.VITE_APP_GET_COLLECTION_STOREFRONT_PRODUCTS,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useGetCollectionStoreFrontProducts.ts:37 ~ error:",
          error
        );
      }
    },
    { enabled: !!(collectionId && checked) }
  );
};
