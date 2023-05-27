import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";

import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useCreateStore = () => {
  const { userId, refetch } = useUser();

  return useMutation(
    async (storeInfo: any) => {
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
