import { useLocation } from "contexts/locationContext/LocationContext";
import { useInfiniteQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetProposals = ({
  flag,
  driverManagementId,
}: {
  flag: string;
  driverManagementId: string;
}) => {
  const [{ country }] = useLocation();
  return useInfiniteQuery(
    [flag],
    async ({ pageParam }) => {
      try {
        const result = await fetchApi({
          arg: [{ lastDoc: pageParam, country, flag, driverManagementId }],
          url: `getProposals`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useGetProposals.ts:9 ~ returnuseInfiniteQuery ~ error:",
          error
        );
      }
    },
    {
      // getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    }
  );
};
