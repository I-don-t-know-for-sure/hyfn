import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { useMutation } from "react-query";

import { fetchApi } from "util/fetch";

export const useConfirmOrderDelivery = () => {
  const [{ country }] = useLocation();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    ["confrimOrderDelivery"],
    async ({
      orderId,

      newRating,
    }: {
      orderId: string;

      newRating: number;
    }) => {
      try {
        const result = await fetchApi({
          arg: [
            { country, orderId, customerId: userDocument.id },
            { newRating },
          ],
          url: import.meta.env.VITE_APP_CONFIRM_ORDER_DELIVERY,
        });

        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useDeliveryConfirmation.ts:34 ~ useConfirmOrderDelivery ~ error:",
          error
        );
      }
    }
  );
};
