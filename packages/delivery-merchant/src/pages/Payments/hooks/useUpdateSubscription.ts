import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useUpdateSubscription = () => {
  return useMutation(async ({ numberOfMonths }: { numberOfMonths: number }) => {
    try {
      const result = await fetchApi({
        arg: [{ numberOfMonths }],
        url: `updateSubscibtion`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useUpdateSubscription.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
