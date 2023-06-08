import { randomId } from "@mantine/hooks";

import { Auth } from "aws-amplify";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetOrders = () => {
  // const { user } = useRealmApp()
  // const driverId = user?.id

  const { userDocument: user } = useUser();

  const id = randomId();
  // const { data } = useRefreshCustomUserData()

  const [{ city, country, coords }] = useLocation();

  return useInfiniteQuery(
    "orders",
    async ({ pageParam }) => {
      try {
        console.log(coords);

        const result = await fetchApi({
          url: `getAvailableOrders`,
          arg: [
            // [32.432, 13.432],
            coords,
            {
              city: city,
              country,
              driverId: user.driverId,
              lastDoc: pageParam,
            },
          ],
        });

        return result;
      } catch (e) {
        console.error(e);
      }
    },
    {
      keepPreviousData: true,
      // getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    }
  );
};
