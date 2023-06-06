import { randomId } from "@mantine/hooks";

import { useLocation } from "../../../contexts/locationContext/LocationContext";
import { useUser } from "../../../contexts/userContext/User";

import { useInfiniteQuery, useMutation } from "react-query";

import { fetchApi } from "../../../util/fetch";

export const useGetOrderHistory = () => {
  const [location] = useLocation();

  const { userId, userDocument, isLoading, refetch } = useUser();

  return useInfiniteQuery(
    ["orderHistory"],
    async ({ pageParam }) => {
      const result = await fetchApi({
        url: `getOrderHistory`,
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
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      enabled: !isLoading,
    }
  );
};
