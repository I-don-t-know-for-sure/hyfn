import { useQuery } from "react-query";
import { fetchApi } from "util/fetch";

export const useSearch = ({ searchValue }: { searchValue: string }) => {
  return useQuery(
    [],
    async () => {
      const hits = await fetchApi({
        url: "getSearchHits",
        arg: [{ searchValue }]
      });
      return hits;
    },
    {
      enabled: !!searchValue
    }
  );
};
