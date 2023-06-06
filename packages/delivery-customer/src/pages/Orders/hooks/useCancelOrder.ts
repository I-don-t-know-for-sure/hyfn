import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import { fetchApi } from "util/fetch";

export const useCancelOrder = () => {
  const [{ country }] = useLocation();
  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ orderId, country }],
        url: `cancelOrder`,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  });
};
