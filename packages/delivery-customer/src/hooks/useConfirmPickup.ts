import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import { fetchApi } from "util/fetch";

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
        const result = await fetchApi({
          arg: [{ country, orderId, pickupConfirmation }],
          url: `confirmPickup`,
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
