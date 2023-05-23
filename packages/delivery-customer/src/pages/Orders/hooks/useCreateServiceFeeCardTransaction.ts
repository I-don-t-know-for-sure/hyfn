import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useCreateServiceFeeCardTransaction = () => {
  const queryClient = useQueryClient();
  const { userDocument } = useUser();
  const [{ country }] = useLocation();
  return useMutation(
    async ({ orderId }: { orderId: string }) => {
      return fetchUtil({
        reqData: [{ orderId, country, customerId: userDocument.id }],
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/createServiceFeeCardTransaction`,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["activeOrders"]);
      },
    }
  );
};
