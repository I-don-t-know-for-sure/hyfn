import { randomId } from "@mantine/hooks";

import { useLocation } from "../../../contexts/locationContext/LocationContext";
import { useUser } from "../../../contexts/userContext/User";

import { t } from "../../../util/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchApi } from "../../../util/fetch";

export const useSetProductAsNotFound = () => {
  const { userDocument: user } = useUser();
  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    async ({
      storeId,
      productId,
      orderId,
    }: {
      storeId: string;
      productId: string;
      orderId: string;
    }) => {
      try {
        const result = await fetchApi({
          arg: [
            {
              country,
              storeId,
              productId,

              orderId,
            },
          ],
          url: `setProductAsNotFound`,
        });

        return result;
      } catch (error) {
        console.log("🚀 ~ file: useSetProductAsNotFound.ts:34 ~ error:", error);
      }
    },
    {
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(["activeOrder", user?.orderId]);
      },
    }
  );
};
