import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Auth } from "aws-amplify";
import { orders } from "config/constants";
import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useGetOrders = () => {
  // const { user } = useRealmApp()
  // const driverId = user?.id

  const { userDocument: user } = useUser();

  const id = randomId();
  // const { data } = useRefreshCustomUserData()

  const [{ city, country, coords }] = useLocation();

  return useInfiniteQuery(
    orders,
    async ({ pageParam }) => {
      try {
        console.log(coords);

        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/findOrders`,
          reqData: [
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
        updateNotification({
          message: t("An Error occurred"),
          id,
          color: "red",
          loading: false,
          autoClose: true,
        });
        console.error(e);
      }
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    }
  );
};
