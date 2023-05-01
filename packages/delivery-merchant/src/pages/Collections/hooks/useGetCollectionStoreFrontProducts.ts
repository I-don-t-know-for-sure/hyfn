import { showNotification } from "@mantine/notifications";
import { collectionStoreFrontProducts } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetCollectionStoreFrontProducts = ({
  collectionId,
  checked,
}: {
  collectionId: string;
  checked: boolean;
}) => {
  const { userId, userDocument } = useUser();

  return useQuery(
    [collectionStoreFrontProducts, collectionId],
    async () => {
      try {
        const { country } = userDocument.storeDoc as { country: string };

        const result = await fetchUtil({
          reqData: [
            {
              country,
              storeId: userDocument._id,

              collectionId,
            },
          ],
          url: import.meta.env.VITE_APP_GET_COLLECTION_STOREFRONT_PRODUCTS,
        });
        return result;
      } catch (error) {
        showNotification({
          title: t("Error"),
          message: t("An Error occurred"),
          color: "red",
          autoClose: true,
        });
      }
    },
    { enabled: !!(collectionId && checked) }
  );
};
