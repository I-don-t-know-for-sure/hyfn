import { ACTIVE_ORDERS } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
// import { useLocation } from 'contexts/locationContext/LocationContext';
import { t } from "utils/i18nextFix";
import { useQuery, useQueryClient } from "react-query";
import fetchUtil from "utils/fetch";

export const useRefreshOrderDocument = ({ orderId }: { orderId: string }) => {
  // const [{ country }] = useLocation();
  const { userDocument } = useUser();
  const { country } = userDocument?.storeDoc as { country: string };

  const queryClient = useQueryClient();
  return useQuery(
    [],
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
        console.log("🚀 ~ file: useRefreshOrderDocument.ts:41 ~ error:", error);
      }
    },
    {
      enabled: false,
    }
  );
};
