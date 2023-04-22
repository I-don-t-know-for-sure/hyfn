import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useUpdateSubscription = () => {
  return useMutation(async ({ numberOfMonths }: { numberOfMonths: number }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ numberOfMonths }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/updateSubscibtion`,
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
