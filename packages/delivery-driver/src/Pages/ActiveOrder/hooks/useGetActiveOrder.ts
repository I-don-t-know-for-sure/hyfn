import { randomId } from "@mantine/hooks";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";
import ActiveOrder from "../ActiveOrder";

export const useGetActiveOrder = () => {
  const { userDocument: user, refetch, isLoading } = useUser();
  const [{ country }] = useLocation();

  return useQuery(
    [ActiveOrder, user?.orderId],
    async () => {
      console.log(
        JSON.stringify([
          {
            driverId: user?._id,
            orderId: user?.orderId,
            country,
          },
        ])
      );
      console.log("🚀 ~ file: useGetActiveOrder.ts:29 ~ user", user);
      if (!user.orderId) {
        return "document not found";
      }
      return await fetchUtil({
        reqData: [
          {
            driverId: user?._id,
            orderId: user?.orderId,
            country,
          },
        ],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getActiveOrder`,
      });
    },
    {
      enabled: !isLoading,
    }
  );
};
