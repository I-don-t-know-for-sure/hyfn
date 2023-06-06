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
import { useUser } from "contexts/userContext/User";

export const useDuplicateProduct = () => {
  const id = randomId();
  const { userId, userDocument } = useUser();

  return useMutation(
    async ({ productId, times }: { productId: string; times: number }) => {
      try {
        const result = await fetchApi({
          arg: [{ productId, times }],
          url: `duplicateProduct`,
        });

        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useDuplicateProduct.ts:27 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
