import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useCreateLocalCardTransaction = () => {
  const queryClient = useQueryClient();
  const { userDocument } = useUser();
  const [{ country }] = useLocation();
  return useMutation(
    async ({ storeId, orderId }: { storeId: string; orderId: string }) => {
      return fetchUtil({
        reqData: [{ storeId, orderId, country, customerId: userDocument.id }],
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/createStoreLocalCardTransaction`,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["activeOrders"]);
      },
    }
  );
};
