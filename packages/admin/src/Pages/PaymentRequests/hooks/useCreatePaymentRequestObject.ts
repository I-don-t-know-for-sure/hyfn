import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

import { randomId } from "@mantine/hooks";

export const useCreatePaymentRequestObject = () => {
  const id = randomId();
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ transactionId }],
        url: `createPaymentRequestObject`,
      });

      return result;
    } catch (error) {
      console.error(error);
    }
  });
};
