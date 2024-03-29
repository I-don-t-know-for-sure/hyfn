import { useMantineColorScheme } from "@mantine/core";
import { randomId, useColorScheme } from "@mantine/hooks";
import { useUser } from "contexts/userContext/User";
import { goToLightbox } from "hyfn-client";
import { useMutation } from "react-query";

import { fetchApi } from "utils/fetch";

export const useCreateTransaction = () => {
  const id = randomId();
  const { userDocument } = useUser();
  const { colorScheme } = useMantineColorScheme();
  return useMutation(async ({ amount }: { amount: number }) => {
    try {
      const result = await fetchApi({
        arg: [{ amount, userId: userDocument.id }],
        url: `createTransaction`,
      });

      goToLightbox({
        colorScheme,
        data: result,
        paymentAppUrl: import.meta.env.VITE_APP_PAYMENT_APP_URL,
        validationUrl: `${
          import.meta.env.VITE_APP_BASE_URL
        }/validateLocalCardTransaction}`,
      });

      return result;
    } catch (error) {
      throw error;
    }
  });
};
