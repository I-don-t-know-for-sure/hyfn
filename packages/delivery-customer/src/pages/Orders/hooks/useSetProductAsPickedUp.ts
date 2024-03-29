import { randomId } from "@mantine/hooks";

import { useLocation } from "../../../contexts/locationContext/LocationContext";
import { useUser } from "../../../contexts/userContext/User";

import { t } from "../../../util/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchApi } from "../../../util/fetch";

export const useSetProductAsPickedUp = () => {
  const { userDocument: user } = useUser();

  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    async ({
      storeId,
      productId,
      orderId,
      QTYFound,
    }: {
      storeId: string;
      orderId: string;
      productId: string;
      QTYFound: number;
    }) => {
      try {
        console.log(
          JSON.stringify([
            {
              country,
              storeId,
              productId,
              QTYFound,
              driver: user?.id,
            },
          ])
        );
        console.log({
          country,
          storeId,
          productId,
          QTYFound,

          driverId: user?.id,
        });
        const result = await fetchApi({
          arg: [
            {
              country,
              storeId,
              productId,
              QTYFound,
              orderId,
            },
          ],
          url: `setProductAsPickedUp`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useSetProductAsPickedUp.ts:62 ~ useSetProductAsPickedUp ~ error:",
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
