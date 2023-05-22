import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";

export const useSetProductAsPickedUp = () => {
  const { userDocument: user } = useUser();

  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    async ({
      orderId,
      productId,

      QTYFound,
    }: {
      orderId: string;
      productId: string;
      QTYFound: number;
    }) => {
      try {
        console.log(
          JSON.stringify([
            {
              productId,
              QTYFound,
            },
          ])
        );
        console.log({
          productId,
          QTYFound,
        });
        const result = await fetchUtil({
          reqData: [
            {
              orderId,
              productId,
              QTYFound,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/setProductAsPickedUp`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useSetProductAsPickedUp.ts:52 ~ useSetProductAsPickedUp ~ error:",
          error
        );
      }
    },
    {
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(["activeOrder", user.orderId]);
      },
    }
  );
};
