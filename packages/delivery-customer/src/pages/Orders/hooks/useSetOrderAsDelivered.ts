import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import { fetchApi } from "util/fetch";

export const useSetOrderAsDelivered = () => {
  const [{ country }] = useLocation();
  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ orderId, country }],
        url: `setOrderAsDelivered`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useSetOrderAsDelivered.ts:9 ~ returnuseMutation ~ error",
        error
      );
    }
  });
};
