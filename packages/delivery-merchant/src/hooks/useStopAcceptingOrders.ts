import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useStopAcceptingOrders = () => {
  return useMutation(async () => {
    try {
      const result = await fetchApi({
        arg: [{}],
        url: `stopAcceptingOrders`,
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
