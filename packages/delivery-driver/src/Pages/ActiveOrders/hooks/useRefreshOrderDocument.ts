import { useLocation } from "contexts/locationContext/LocationContext";

// import { useLocation } from 'contexts/locationContext/LocationContext';

import { useQuery, useQueryClient } from "react-query";
import { fetchApi } from "utils/fetch";

export const useRefreshOrderDocument = ({ orderId }: { orderId: string }) => {
  const [{ country }] = useLocation();

  const queryClient = useQueryClient();
  return useQuery(
    [],
    async () => {
      try {
        const result = await fetchApi({
          arg: [{ orderId }],
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
        console.log("🚀 ~ file: useRefreshOrderDocument.ts:40 ~ error:", error);
      }
    },
    {
      enabled: false,
    }
  );
};
