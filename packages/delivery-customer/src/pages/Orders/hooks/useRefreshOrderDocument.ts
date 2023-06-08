import { useLocation } from "contexts/locationContext/LocationContext";
import { t } from "util/i18nextFix";
import { useQuery, useQueryClient } from "react-query";
import { fetchApi } from "util/fetch";

export const useRefreshOrderDocument = ({ orderId }: { orderId: string }) => {
  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  return useQuery(
    [orderId],
    async () => {
      try {
        const result = await fetchApi({
          arg: [{ orderId, country }],
          url: `getOrder`,
        });

        const cachedQuery = queryClient.getQueryData(["ACTIVE_ORDERS"]) as {
          pages: any[];
        };
        const newQuerydata = cachedQuery.pages.map((page) => {
          return page.map((order) => {
            if (order.id === orderId) {
              return { ...result, updated: true };
            }
            return order;
          });
        });
        queryClient.setQueryData(["ACTIVE_ORDERS"], () => ({
          ...cachedQuery,
          pages: newQuerydata,
        }));

        return;
      } catch (error) {
        console.log("🚀 ~ file: useRefreshOrderDocument.ts:37 ~ error:", error);
      }
    },
    {
      enabled: false,
    }
  );
};
