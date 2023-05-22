import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

import { randomId } from "@mantine/hooks";

export const useCreatePaymentRequestObject = () => {
  const id = randomId();
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ transactionId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createPaymentRequestObject`,
      });

      return result;
    } catch (error) {
      console.error(error);
    }
  });
};
