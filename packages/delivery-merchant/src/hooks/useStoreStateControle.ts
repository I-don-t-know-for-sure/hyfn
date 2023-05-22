import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useStoreStateControl = () => {
  const { userId, userDocument, refetch } = useUser();

  const id = randomId();
  return useMutation(["storeState", userDocument?.opened], async () => {
    try {
      const result = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/openAndCloseStore`,
        reqData: [userDocument?.id],
      });

      refetch();
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useStoreStateControle.ts:27 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
