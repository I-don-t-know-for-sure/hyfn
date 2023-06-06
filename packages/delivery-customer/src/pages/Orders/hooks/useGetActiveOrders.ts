import { randomId } from "@mantine/hooks";

import { ACTIVE_ORDERS } from "hyfn-types";
import { useLocation } from "../../../contexts/locationContext/LocationContext";
import { useUser } from "../../../contexts/userContext/User";

import { useInfiniteQuery } from "react-query";

import { fetchApi } from "../../../util/fetch";

export const useGetActiveOrders = () => {
  const [location] = useLocation();
  const { userDocument, isLoading } = useUser();

  return useInfiniteQuery(
    [ACTIVE_ORDERS],
    async ({ pageParam }) => {
      const result = await fetchApi({
        url: `getActiveOrders`,
        arg: [
          {
            country: location.country,
            customerId: userDocument.id,
            lastDoc: pageParam,
          },
        ],
      });
      console.log(result);

      return result;
    },
    {
      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      enabled: !isLoading,
    }
  );
};
