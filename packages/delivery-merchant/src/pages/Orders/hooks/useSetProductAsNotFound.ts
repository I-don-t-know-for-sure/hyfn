import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { fetchApi } from "utils/fetch";

export const useSetProductAsNotFound = () => {
  const { userDocument: user } = useUser();

  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    async ({ orderId, productId }: { orderId: string; productId: string }) => {
      try {
        const result = await fetchApi({
          arg: [
            {
              orderId,
              productId,
            },
          ],
          url: `setProductAsNotFound`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useSetProductAsNotFound.ts:36 ~ useSetProductAsNotFound ~ error:",
          error
        );
      }
    },
    {
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(["activeOrder"]);
      },
    }
  );
};
