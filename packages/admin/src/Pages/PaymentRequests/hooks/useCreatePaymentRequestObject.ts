import { useInfiniteQuery, useMutation } from "react-query";
import fetchUtil from "utils/fetch";
import { showNotification, updateNotification } from "@mantine/notifications";
import { randomId } from "@mantine/hooks";
import {
  errorNotification,
  loadingNotification,
  successNotification,
} from "hyfn-client";

export const useCreatePaymentRequestObject = () => {
  const id = randomId();
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      showNotification({
        ...loadingNotification,
        id,
      });
      const result = await fetchUtil({
        reqData: [{ transactionId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createPaymentRequestObject`,
      });
      updateNotification({
        ...successNotification,
        id,
      });
      return result;
    } catch (error) {
      updateNotification({
        ...errorNotification,
        id,
      });
      console.log(
        "🚀 ~ file: useGetPaymentRequests.ts:8 ~ returnuseInfiniteQuery ~ error",
        error
      );
    }
  });
};
