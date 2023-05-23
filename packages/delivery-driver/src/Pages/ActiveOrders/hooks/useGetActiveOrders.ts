import { randomId } from "@mantine/hooks";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { useInfiniteQuery } from "react-query";

import fetchUtil from "utils/fetch";
import ActiveOrder from "../ActiveOrders";

export const useGetActiveOrders = () => {
  const { userDocument: user, refetch, isLoading } = useUser();
  const [{ country }] = useLocation();

  return useInfiniteQuery(
    [ActiveOrder, user?.orderId],
    async ({ pageParam }) => {
      console.log("🚀 ~ file: useGetActiveOrder.ts:29 ~ user", user);
      // if (!user.orderId) {
      //   return "document not found";
      // }
      return await fetchUtil({
        reqData: [
          {
            driverId: user?.id,
            orderId: user?.orderId,
            country,
            lastDoc: pageParam,
          },
        ],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getActiveOrders`,
      });
    },
    {
      enabled: !isLoading,

      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    }
  );
};
