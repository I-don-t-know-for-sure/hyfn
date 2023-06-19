import { useMutation, useQuery } from "react-query";

import { fetchApi } from "util/fetch";

export const useGetProduct = (
  locationInfo: {
    storefront: string;

    productId: string;
  },
  withStoreDoc: boolean
) => {
  return useQuery(
    ["PRODUCT", locationInfo.productId],
    async () => {
      try {
        return await fetchApi({
          url: `getProduct`,
          arg: [locationInfo, withStoreDoc]
        });
      } catch (e) {
        console.error(e);
      }
    },
    {}
  );
};
