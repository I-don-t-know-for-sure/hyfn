import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";

export const useSetProductAsNotFound = () => {
  const { userDocument: user } = useUser();

  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    async ({ orderId, productId }: { orderId: string; productId: string }) => {
      try {
        const result = await fetchUtil({
          reqData: [
            {
              orderId,
              productId,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/setProductAsNotFound`,
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
