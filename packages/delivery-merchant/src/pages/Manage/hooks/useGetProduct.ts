import { useUser } from "contexts/userContext/User";
import { useQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useGetProduct = (productId?: string) => {
  const { userId, userDocument } = useUser();

  return useQuery(["product", productId], async () => {
    try {
      const res = await fetchApi({
        url: `getProduct`,
        arg: [userDocument?.id, productId],
      });

      return res;
    } catch (e) {
      console.error(e);
    }
  });
};
