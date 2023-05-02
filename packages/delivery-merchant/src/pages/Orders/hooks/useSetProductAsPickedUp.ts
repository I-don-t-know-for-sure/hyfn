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
      productKey,

      QTYFound,
    }: {
      orderId: string;
      productKey: string;
      QTYFound: number;
    }) => {
      try {
        console.log(
          JSON.stringify([
            {
              productKey,
              QTYFound,
            },
          ])
        );
        console.log({
          productKey,
          QTYFound,
        });
        const result = await fetchUtil({
          reqData: [
            {
              orderId,
              productKey,
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
