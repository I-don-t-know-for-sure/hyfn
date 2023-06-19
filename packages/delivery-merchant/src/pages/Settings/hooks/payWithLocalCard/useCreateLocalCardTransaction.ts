import { randomId } from "@mantine/hooks";
import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";

import { fetchApi } from "utils/fetch";

export const useCreateLocalCatdTransaction = () => {
  const id = randomId();
  const { userId, userDocument } = useUser();

  return useMutation(async ({ amount }: { amount: number }) => {
    try {
      const result = await fetchApi({
        arg: [{ amount, userId: userDocument.id }],
        url: `createTransaction`,
      });

      return result;
    } catch (error) {
      throw error;
    }
  });
};
