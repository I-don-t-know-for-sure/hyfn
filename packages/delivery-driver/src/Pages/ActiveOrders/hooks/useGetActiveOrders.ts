import { randomId } from "@mantine/hooks";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { useInfiniteQuery } from "react-query";

import { fetchApi } from "utils/fetch";
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
      return await fetchApi({
        arg: [
          {
            driverId: user?.id,
            orderId: user?.orderId,
            country,
            lastDoc: pageParam,
          },
        ],
        url: `getActiveOrders`,
      });
    },
    {
      enabled: !isLoading,

      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    }
  );
};
