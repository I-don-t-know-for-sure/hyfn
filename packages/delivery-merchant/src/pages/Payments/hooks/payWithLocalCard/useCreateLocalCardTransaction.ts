import { randomId } from "@mantine/hooks";
import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";
import { progressNotification } from "utils/notifications/progressNotifaction";
import { updateToErrorNotification } from "utils/notifications/updateProgressToErrorNotification";
import { updateToSuccessfulNotification } from "utils/notifications/updateProgressToSuccessfulNotification";

export const useCreateLocalCatdTransaction = () => {
  const id = randomId();
  const { userId, userDocument } = useUser();

  return useMutation(async ({ amount }: { amount: number }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ amount, userId: userDocument._id }],
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/createLocalCardTransactionForWallet`,
      });

      return result;
    } catch (error) {
      throw error;
    }
  });
};
