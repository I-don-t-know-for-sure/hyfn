import useUploadImage from "hooks/useUploadImage";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import { ProductInfo } from "../types";
import { randomId } from "@mantine/hooks";
import { fetchApi } from "utils/fetch";
import { t } from "utils/i18nextFix";
import { productsSearch } from "hyfn-types";
import { useUser } from "contexts/userContext/User";

export const useSearchProducts = (value: string) => {
  const { userId, userDocument } = useUser();

  return useQuery(
    [productsSearch, value],
    async () => {
      try {
        const { country, storeFrontId: storeId } = userDocument.storeDoc as {
          country: string;
          storeFrontId: string;
        };

        const result = await fetchApi({
          arg: [{ value, country, storeId }],
          url: import.meta.env.VITE_APP_SEARCH_PRODUCTS,
        });
        return result;
      } catch (error) {
        console.log("🚀 ~ file: useSearchProducts.ts:36 ~ error:", error);
      }
    },
    {
      keepPreviousData: true,

      enabled: !!value,
    }
  );
};
