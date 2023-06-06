import { t } from "utils/i18nextFix";
import { useMutation } from "react-query";
import { fetchApi } from "../../../utils/fetch";

export const useCreateStore = () => {
  return useMutation(async (storeInfo: any) => {
    try {
      const result = await fetchApi({
        arg: [storeInfo],
        url: `createStoreDocument`,
      });

      return result;
    } catch (e) {
      console.error(e);
    }
  });
};
