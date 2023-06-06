import { randomId } from "@mantine/hooks";

import {
  errorNotificatin,
  progressNotification,
  successNotification,
} from "hyfn-types";
import { useMutation } from "react-query";

import { fetchApi } from "utils/fetch";

export const useValidateLocalCardTransaction = () => {
  const id = randomId();
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ transactionId }],
        url: `validateLocalCardTransaction`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useValidateLocalCardTransaction.ts:26 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
