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
export const useBulkWrite = () => {
  const { userDocument } = useUser();

  const id = randomId();
  return useMutation(async (productsArray: any) => {
    try {
      const result = await fetchUtil({
        reqData: [{ productsArray, storeId: userDocument._id }],
        url: import.meta.env.VITE_APP_BULK_WRITE,
      });
      return result;
    } catch (error) {
      throw error;
    }
  });
};
