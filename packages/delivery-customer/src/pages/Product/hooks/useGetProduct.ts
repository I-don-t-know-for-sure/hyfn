import { PRODUCT } from "hyfn-types";

import { useMutation, useQuery } from "react-query";

import fetchUtil from "util/fetch";

export const useGetProduct = (
  locationInfo: {
    storefront: string;
    city: string;
    country: string;
    productId: string;
  },
  withStoreDoc: boolean
) => {
  return useQuery(
    [PRODUCT, locationInfo.productId],
    async () => {
      try {
        return await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/getProduct`,
          reqData: [locationInfo, withStoreDoc],
        });
      } catch (e) {
        console.error(e);
      }
    },
    {}
  );
};
