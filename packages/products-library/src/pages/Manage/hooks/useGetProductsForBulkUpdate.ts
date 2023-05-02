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

export const useGetProductsForBulkUpdate = ({
  lastDocId,
  check,
  filterText,
}) => {
  const { userDocument } = useUser();

  return useInfiniteQuery(
    ["products", check],
    async ({ queryKey, pageParam }) => {
      return await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/getProducts`,

        reqData: [{ lastProductId: queryKey[1] }],
      });
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      // enabled: !filterText,
    }
  );
};
