import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
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
      showNotification({ ...progressNotification, message: "", id });
      const result = await fetchUtil({
        reqData: [{ amount, userId: user._id }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createLocalCardTransaction`,
      });
      updateNotification({ ...successNotification, message: "", id });
      return result;
    } catch (error) {
      updateNotification({ ...errorNotificatin, id, message: "" });
      throw error;
    }
  });
};
