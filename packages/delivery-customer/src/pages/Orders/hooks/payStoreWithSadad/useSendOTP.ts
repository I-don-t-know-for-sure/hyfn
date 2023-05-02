import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useSendOTP = () => {
  const { userId } = useUser();

  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ orderId, storeId }: { storeId: string; orderId: string }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ customerId: userId, storeId, country, orderId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/sendOTPForSadad`,
        });
        return result;
      } catch (error) {
        console.log("🚀 ~ file: useSendOTP.ts:23 ~ error:", error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    }
  );
};
