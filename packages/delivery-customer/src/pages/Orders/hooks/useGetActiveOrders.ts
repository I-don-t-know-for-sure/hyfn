import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { ACTIVE_ORDERS } from "hyfn-types";
import { useLocation } from "../../../contexts/locationContext/LocationContext";
import { useUser } from "../../../contexts/userContext/User";

import { useInfiniteQuery } from "react-query";

import fetchUtil from "../../../util/fetch";

export const useGetActiveOrders = () => {
  const [location] = useLocation();
  const { userDocument, isLoading } = useUser();

  return useInfiniteQuery(
    [ACTIVE_ORDERS],
    async ({ pageParam }) => {
      const result = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/getActiveOrders`,
        reqData: [
          {
            country: location.country,
            customerId: userDocument._id,
            lastDoc: pageParam,
          },
        ],
      });
      console.log(result);

      return result;
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      enabled: !isLoading,
    }
  );
};
