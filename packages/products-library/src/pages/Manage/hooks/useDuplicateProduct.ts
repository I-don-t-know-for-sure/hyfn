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

export const useDuplicateProduct = () => {
  const id = randomId();
  const { userDocument } = useUser();

  return useMutation(
    async ({ productId, times }: { productId: string; times: number }) => {
      try {
        const { country } = userDocument.storeDoc as { country: string };
        const result = await fetchUtil({
          reqData: [{ country, productId, times }],
          url: import.meta.env.VITE_APP_DUPLICATE_PRODUCT,
        });

        return result;
      } catch (error) {
        throw error;
      }
    }
  );
};
