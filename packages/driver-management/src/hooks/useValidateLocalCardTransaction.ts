import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
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
      showNotification({ ...progressNotification, id, message: "" });
      const result = await fetchUtil({
        reqData: [{ transactionId }],
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/validateLocalCardTransaction`,
      });
      updateNotification({ ...successNotification, id, message: "" });
      return result;
    } catch (error) {
      updateNotification({ ...errorNotificatin, id, message: "" });
    }
  });
};
