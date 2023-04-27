import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useSendNotification = () => {
  return useMutation(async () => {
    try {
      const result = await fetchUtil({
        reqData: [{}],
        url: `${import.meta.env.VITE_APP_BASE_URL}/sendNotification`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useSendNotification.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
