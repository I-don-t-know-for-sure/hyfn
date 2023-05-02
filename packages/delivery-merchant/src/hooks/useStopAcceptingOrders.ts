import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useStopAcceptingOrders = () => {
  return useMutation(async () => {
    try {
      const result = await fetchUtil({
        reqData: [{}],
        url: `${import.meta.env.VITE_APP_BASE_URL}/stopAcceptingOrders`,
      });
      result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useStopAcceptingOrders.ts:6 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
