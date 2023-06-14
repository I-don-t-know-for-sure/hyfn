import { useInfiniteQuery } from "react-query";

import { fetchApi } from "utils/fetch";

import { useUser } from "contexts/userContext/User";

export const useSearchProducts = ({
  filter,
  searchValue
}: {
  searchValue: string;
  filter: string;
}) => {
  console.log(
    "🚀 ~ file: useSearchProducts.ts:24 ~ searchValue:",
    !!searchValue
  );
  const { userDocument } = useUser();

  return useInfiniteQuery(
    ["productsSearch", searchValue],
    async () => {
      try {
        const result = await fetchApi({
          arg: [{ searchValue, storeId: userDocument.id, filter }],
          url: "getSearchHits"
        });
        return result;
      } catch (error) {
        console.log("🚀 ~ file: useSearchProducts.ts:36 ~ error:", error);
        throw new Error(error);
      }
    },
    {
      keepPreviousData: true,

      enabled: !!searchValue
    }
  );
};
