import { randomId } from "@mantine/hooks";

import {
  errorNotificatin,
  progressNotification,
  successNotification,
} from "hyfn-types";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useValidateLocalCardTransaction = () => {
  const id = randomId();
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ transactionId }],
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/validateLocalCardTransaction`,
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
