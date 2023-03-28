import { useLocation } from "contexts/locationContext/LocationContext";
import { useInfiniteQuery } from "react-query";
import fetchUtil from "utils/fetch";

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
        const result = await fetchUtil({
          reqData: [{ lastDoc: pageParam, country, flag, driverManagementId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getProposals`,
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
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    }
  );
};
