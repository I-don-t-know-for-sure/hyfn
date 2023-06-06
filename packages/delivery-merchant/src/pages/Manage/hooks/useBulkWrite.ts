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
export const useBulkWrite = () => {
  const { userId, userDocument } = useUser();

  const id = randomId();
  return useMutation(async (productsArray: any) => {
    try {
      const result = await fetchApi({
        arg: [{ productsArray, storeId: userDocument.id }],
        url: `bulkWrite`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useBulkWrite.ts:28 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
