import { randomId } from "@mantine/hooks";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";

export const useSetProductAsPickedUp = () => {
  const { userDocument: user } = useUser();

  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    async ({
      storeId,
      productKey,

      QTYFound,
    }: {
      storeId: string;
      productKey: string;
      QTYFound: number;
    }) => {
      try {
        console.log(
          JSON.stringify([
            {
              country,
              storeId,
              productKey,
              QTYFound,
              driver: user?.id,
            },
          ])
        );
        console.log({
          country,
          storeId,
          productKey,
          QTYFound,

          driverId: user?.id,
        });

        const result = await fetchUtil({
          reqData: [
            {
              country,
              storeId,
              productKey,
              QTYFound,

              driverId: user?.id,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/setProductAsPickedUp`,
        });

        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useSetProductAsPickedUp.ts:65 ~ useSetProductAsPickedUp ~ error:",
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
