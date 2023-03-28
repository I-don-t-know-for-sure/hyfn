import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useSetDeliveryFeePaid = () => {
  const [{ country }] = useLocation();
  return useMutation(async () => {
    try {
      const result = await fetchUtil({
        reqData: [{ country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/setDeliveryFeePaid`,
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
