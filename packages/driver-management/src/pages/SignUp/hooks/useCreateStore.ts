import { t } from "utils/i18nextFix";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useCreateStore = () => {
  return useMutation(async (storeInfo: any) => {
    try {
      const result = await fetchUtil({
        reqData: [storeInfo],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createStoreDocument`,
      });

      return result;
    } catch (e) {
      console.error(e);
    }
  });
};
