import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const usePickupOrder = () => {
  const [{ country }] = useLocation();
  return useMutation(
    async ({
      confirmationCode,
      orderId,
    }: {
      confirmationCode: string;
      orderId: string;
    }) => {
      try {
        const result = await fetchApi({
          arg: [{ pickupConfirmation: confirmationCode, country, orderId }],
          url: `setOrderAsPickedUp`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: PickupOrderModal.ts:8 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
