import { randomId } from "@mantine/hooks";

import {
  errorNotificatin,
  progressNotification,
  successNotification,
} from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useCreateLocalCardTransaction = () => {
  const { userDocument: user } = useUser();

  const id = randomId();
  return useMutation(async ({ amount }: { amount: number }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ amount, userId: user._id }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createLocalCardTransaction`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useCreateLocalCardTransaction.ts:27 ~ returnuseMutation ~ error:",
        error
      );

      throw error;
    }
  });
};
