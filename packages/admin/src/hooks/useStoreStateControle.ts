import { t } from "utils/i18nextFix";
import { useMutation } from "react-query";
import { useUser } from "../contexts/userContext/User";
import { fetchApi } from "../utils/fetch";

export const useStoreStateControl = () => {
  const { userId, userDocument, refetch } = useUser();

  return useMutation(["storeState", userDocument?.opened], async () => {
    try {
      const { country } = userDocument?.storeDoc as { country: string };

      const result = await fetchApi({
        url: `openAndCloseStore`,
        arg: [userDocument?.id, country],
      });

      refetch();
      return result;
    } catch (error) {
      console.error(error);
    }
  });
};
