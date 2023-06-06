import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useSetDeliveryFeePaid = () => {
  const [{ country }] = useLocation();
  return useMutation(async () => {
    try {
      const result = await fetchApi({
        arg: [{ country }],
        url: `setDeliveryFeePaid`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useSetDeliveryFeePaid.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
