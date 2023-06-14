import { useUser } from "hyfn-client";
import { useInfiniteQuery, useQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetCollections = ({
  filter,
  searchValue
}: {
  filter: string;
  searchValue: string;
}) => {
  const { userDocument } = useUser();
  return useInfiniteQuery(
    [],
    async ({ pageParam }) => {
      const result = await fetchApi({
        url: "getAllCollections",
        arg: [{ storeId: userDocument.id, filter, lastDoc: pageParam }]
      });
      return result;
    },
    {
      keepPreviousData: true,
      enabled: !searchValue
    }
  );
};
