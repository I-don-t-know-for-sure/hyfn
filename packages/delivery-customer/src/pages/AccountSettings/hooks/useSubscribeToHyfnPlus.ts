import { goToLightbox } from "hyfn-client";
import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useSubscribeToHyfnPlus = () => {
  return useMutation(async ({ numberOfMonths }: { numberOfMonths: number }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ numberOfMonths }],
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/createSubscriptionTransaction`,
      });
      goToLightbox({
        data: result,
        colorScheme: "",
        validationUrl: "",
        paymentAppUrl: "",
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useSubscribeToHyfnPlus.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
