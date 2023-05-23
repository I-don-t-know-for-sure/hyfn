import { useUser } from "../../../contexts/userContext/User";
import { t } from "../../../util/i18nextFix";
import { useMutation, useQueryClient } from "react-query";
import fetchUtil from "../../../util/fetch";

export const useManageAddresses = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    async ({ addresses }: { addresses: any[] }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ addresses, customerId: userDocument.id }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateAddresses`,
        });

        return result;
      } catch (error) {
        console.log("🚀 ~ file: manageAddresses.ts:22 ~ error:", error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    }
  );
};
