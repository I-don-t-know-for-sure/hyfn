import { goToLightbox } from "hyfn-client";
import { subscriptionPayment } from "hyfn-types";
import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useSubscribeToHyfnPlus = () => {
  return useMutation(async ({ numberOfMonths }: { numberOfMonths: number }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ numberOfMonths, type: subscriptionPayment }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createTransaction`,
      });
      goToLightbox({
        data: result,
        colorScheme: "",
        validationUrl: "",
        paymentAppUrl: import.meta.env.VITE_APP_PAYMENT_APP_URL,
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
