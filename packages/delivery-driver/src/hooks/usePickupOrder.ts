import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

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
        const result = await fetchUtil({
          reqData: [{ pickupConfirmation: confirmationCode, country, orderId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/confirmPickup`,
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
