import { useUser } from "contexts/userContext/User";
import { useMutation, useQueryClient } from "react-query";
import { fetchApi } from "utils/fetch";

export const useUpdateLocalCardSettings = () => {
  const queryClient = useQueryClient();
  const { userDocument } = useUser();
  const storeDoc = userDocument?.storeDoc as { id: string };
  const id = storeDoc ? storeDoc.id : "noid";

  return useMutation(
    async () => {
      try {
        const result = await fetchApi({
          arg: [],
          url: `updateLocalCardSettings`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useUpdateLocalCardSettings.ts:8 ~ returnuseMutation ~ error:",
          error
        );
      }
    },
    {
      async onSettled(data, error, variables, context) {
        queryClient.invalidateQueries([id]);
      },
    }
  );
};
