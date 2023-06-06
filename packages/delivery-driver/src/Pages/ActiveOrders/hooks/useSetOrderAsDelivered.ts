import { randomId } from "@mantine/hooks";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { fetchApi } from "utils/fetch";

export const useSetOrderAsDelivered = () => {
  const { userDocument: user } = useUser();
  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    ["setOrderAsDelievered"],
    async ({ confirmationCode }: { confirmationCode: string }) => {
      try {
        const result = await fetchApi({
          arg: [{ country, id: user?.id, confirmationCode }],
          url: `setOrderAsDelivered`,
        });

        return result;
      } catch (error) {
        console.log("🚀 ~ file: useSetOrderAsDelivered.ts:28 ~ error:", error);
      }
    },
    {
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(["activeOrder", user.orderId]);
      },
    }
  );
};
