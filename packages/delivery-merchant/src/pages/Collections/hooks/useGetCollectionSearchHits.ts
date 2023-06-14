import { useInfiniteQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetCollectionSearchHits = ({
  filter,
  searchValue
}: {
  searchValue: string;
  filter: string;
}) => {
  console.log(
    "🚀 ~ file: useGetCollectionSearchHits.ts:11 ~ searchValue:",
    !!searchValue
  );
  return useInfiniteQuery(
    [],
    async () => {
      const result = await fetchApi({
        url: "getCollectionSearchHits",
        arg: [{ filter, searchValue }]
      });

      return result;
    },
    {
      enabled: !!searchValue,
      keepPreviousData: true
    }
  );
};
