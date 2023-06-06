import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { useInfiniteQuery } from "react-query";

import { fetchApi } from "utils/fetch";
import OrderHistory from "../OrderHistory";

export const useGetOrderHistory = () => {
  const { userDocument: user, refetch, isLoading } = useUser();

  const [{ country }] = useLocation();

  return useInfiniteQuery(
    [OrderHistory],
    async ({ pageParam }) => {
      return await fetchApi({
        arg: [{ driverId: user.id, country, lastDoc: pageParam }],
        url: `getOrderHistory`,
      });
    },
    {
      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      enabled: !isLoading,
    }
  );
};
