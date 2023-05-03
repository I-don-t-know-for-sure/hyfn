import { randomId } from "@mantine/hooks";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";

export const useSetProductAsNotFound = () => {
  const { userDocument: user } = useUser();
  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    async ({
      storeId,
      productKey,
    }: {
      storeId: string;
      productKey: string;
    }) => {
      try {
        const result = await fetchUtil({
          reqData: [
            {
              country,
              storeId,
              productKey,

              driverId: user?._id,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/setProductAsNotFound`,
        });

        return result;
      } catch (error) {
        console.log("🚀 ~ file: useSetProductAsNotFound.ts:35 ~ error:", error);
      }
    },
    {
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(["activeOrder", user?.orderId]);
      },
    }
  );
};
