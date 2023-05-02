import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";

import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";
export const useDeleteSadadAPIKey = () => {
  const { userId, userDocument } = useUser();

  const queryClient = useQueryClient();
  const storeDoc = userDocument?.storeDoc as { id: string };
  return useMutation(
    async () => {
      const random = randomId();
      try {
        const result = await fetchUtil({
          reqData: [storeDoc],
          url: `${import.meta.env.VITE_APP_BASE_URL}/deleteSadadKey`,
        });
        return result;
      } catch (error) {
        console.log("🚀 ~ file: useDeleteSadadKey.ts:25 ~ error:", error);
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["storeInfo", storeDoc.id]);
      },
    }
  );
};
