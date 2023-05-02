import { randomId } from "@mantine/hooks";

import { useCustomerData } from "contexts/customerData/CustomerDataProvider";
import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";
import { useMutation, useQuery } from "react-query";

import fetchUtil from "util/fetch";
import Product from "../Product";

export const useLikeProduct = () => {
  const { userId } = useUser();

  const { updateLikes } = useCustomerData();
  const id = randomId();
  return useMutation(
    ["productLike"],
    async (storeInfo: {
      storeId: string;
      productId: string;
      city: string;
      country: string;
    }) => {
      try {
        updateLikes(storeInfo.storeId, storeInfo.productId);
        const result = await fetchUtil({
          url: import.meta.env.VITE_APP_LIKEPRODUCT,
          reqData: [{ customerId: userId, ...storeInfo }],
        });

        return result;
      } catch (e) {
        updateLikes(storeInfo.storeId, storeInfo.productId);

        console.error(e);
      }
    }
  );
};
