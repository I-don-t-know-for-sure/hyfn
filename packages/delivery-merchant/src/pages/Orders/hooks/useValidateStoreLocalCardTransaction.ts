// import { useLocation } from 'contexts/locationContext/LocationContext';
import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";

import { fetchApi } from "../../../utils/fetch";

export const useValidateStoreLocalCardTransaction = () => {
  const { userId, userDocument } = useUser();

  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const { country } = userDocument?.storeDoc as { country: string };

      return await fetchApi({
        arg: [{ transactionId, country }],
        url: `validateLocalCardTransaction`,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: useValidateStoreLocalCardTransaction.ts:19 ~ returnuseMutation ~ error",
        error
      );
    }
  });
};
