import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";

export const useCreateStore = () => {
  const { userId, refetch } = useUser();
  const queryclient = useQueryClient();

  return useMutation(
    async (storeInfo: any) => {
      const id = randomId();
      try {
        const result = await fetchUtil({
          reqData: [{ ...storeInfo, userId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/createStoreDocument`,
        });
        return result;
      } catch (e) {
        console.error(e);
      }
    },
    {
      async onSuccess(data, variables, context) {
        refetch();
        // await queryclient.invalidateQueries([USER_DOCUMENT])
      },
    }
  );
};
