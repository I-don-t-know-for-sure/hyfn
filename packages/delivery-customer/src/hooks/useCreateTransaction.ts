import { useMantineColorScheme } from "@mantine/core";
import { goToLightbox } from "hyfn-client";
import { useMutation } from "react-query";
import { fetchApi } from "util/fetch";

export const useCreateTransaction = () => {
  const { colorScheme } = useMantineColorScheme();
  return useMutation(
    async ({
      numberOfMonths,
      country,
      orderId,
      type,
      storeId,
    }: {
      numberOfMonths?: number;
      type: string;
      storeId?: string;
      orderId: string;
      country: string;
    }) => {
      try {
        const result = await fetchApi({
          arg: [{ numberOfMonths, country, orderId, type, storeId }],
          url: `createTransaction`,
        });
        goToLightbox({
          data: result,
          colorScheme,
          validationUrl: `${
            import.meta.env.VITE_APP_BASE_URL
          }/validateTransaction`,
          paymentAppUrl: import.meta.env.VITE_APP_PAYMENT_APP_URL,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useSubscribeToHyfnPlus.ts:8 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
