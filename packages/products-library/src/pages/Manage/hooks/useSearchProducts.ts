import useUploadImage from "hooks/useUploadImage";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import { ProductInfo } from "../types";
import { randomId } from "@mantine/hooks";
import fetchUtil from "utils/fetch";
import { t } from "utils/i18nextFix";
import { useUser } from "contexts/userContext/User";

export const useSearchProducts = (value: string) => {
  const { userDocument } = useUser();

  return useQuery(
    ["products search", value],
    async () => {
      try {
        const { country, storeFrontId: storeId } = userDocument.storeDoc as {
          country: string;
          storeFrontId: string;
        };

        const result = await fetchUtil({
          reqData: [{ value, country, storeId }],
          url: import.meta.env.VITE_APP_SEARCH_PRODUCTS,
        });
        return result;
      } catch (error) {
        throw error;
      }
    },
    {
      keepPreviousData: true,

      enabled: !!value,
    }
  );
};
