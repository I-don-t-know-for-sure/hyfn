import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { ACTIVE_ORDERS } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";

import { useNavigate } from "react-router";

import fetchUtil from "utils/fetch";

export const useGetActiveOrders = () => {
  const { userDocument } = useUser();

  return useInfiniteQuery(
    [ACTIVE_ORDERS],
    async ({ pageParam }) => {
      console.log(
        "🚀 ~ file: useGetActiveOrders.ts:18 ~ pageParam:",
        pageParam
      );
      try {
        const data = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/getActiveOrders`,
          reqData: [
            {
              ...(userDocument?.storeDoc as any),
              status: "confirmed",
              lastDoc: pageParam,
            },
          ],
        });
        return data;
      } catch (e) {
        console.error(e);
      }
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
    }
  );
};
