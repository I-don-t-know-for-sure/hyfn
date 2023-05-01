import { showNotification } from "@mantine/notifications";
import { ACTIVE_ORDERS } from "hyfn-types";
import { useLocation } from "contexts/locationContext/LocationContext";
import { t } from "util/i18nextFix";
import { useQuery, useQueryClient } from "react-query";
import fetchUtil from "util/fetch";

export const useRefreshOrderDocument = ({ orderId }: { orderId: string }) => {
  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  return useQuery(
    [orderId],
    async () => {
      try {
        const result = await fetchUtil({
          reqData: [{ orderId, country }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getOrderDocument`,
        });

        const cachedQuery = queryClient.getQueryData([ACTIVE_ORDERS]) as {
          pages: any[];
        };
        const newQuerydata = cachedQuery.pages.map((page) => {
          return page.map((order) => {
            if (order._id.toString() === orderId) {
              return { ...result, updated: true };
            }
            return order;
          });
        });
        queryClient.setQueryData([ACTIVE_ORDERS], () => ({
          ...cachedQuery,
          pages: newQuerydata,
        }));

        return;
      } catch (error) {
        showNotification({ message: t("Error"), color: "red" });
      }
    },
    {
      enabled: false,
    }
  );
};
