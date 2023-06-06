import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useLeaveOrder = () => {
  const [{ country }] = useLocation();
  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ orderId, country }],
        url: `leaveOrder`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useLeaveOrder.ts:8 ~ returnuseMutation ~ error",
        error
      );
    }
  });
};
