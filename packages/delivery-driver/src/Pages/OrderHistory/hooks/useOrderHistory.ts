import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { useInfiniteQuery } from "react-query";

import fetchUtil from "utils/fetch";
import OrderHistory from "../OrderHistory";

export const useGetOrderHistory = () => {
  const { userDocument: user, refetch, isLoading } = useUser();

  const [{ country }] = useLocation();

  return useInfiniteQuery(
    [OrderHistory],
    async ({ pageParam }) => {
      return await fetchUtil({
        reqData: [{ driverId: user.id, country, lastDoc: pageParam }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getOrderHistory`,
      });
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      enabled: !isLoading,
    }
  );
};
