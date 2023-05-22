import { product } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { useQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetProduct = (productId?: string) => {
  const { userId, userDocument } = useUser();

  return useQuery([product, productId], async () => {
    try {
      const res = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/getProduct`,
        reqData: [userDocument?.id, productId],
      });

      return res;
    } catch (e) {
      console.error(e);
    }
  });
};
