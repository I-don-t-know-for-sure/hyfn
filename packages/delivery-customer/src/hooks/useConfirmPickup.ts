import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useConfirmPickup = () => {
  const [{ country }] = useLocation();
  return useMutation(
    async ({
      orderId,
      pickupConfirmation,
    }: {
      orderId: string;

      pickupConfirmation: string;
    }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ country, orderId, pickupConfirmation }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/confirmPickup`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useConfirmPickup.ts:8 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
