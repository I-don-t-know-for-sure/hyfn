import { useUser } from "../../../contexts/userContext/User";
import { useMutation } from "react-query";

import fetchUtil from "../../../util/fetch";

export const useCreateCustomer = () => {
  const { userId, refetch } = useUser();

  return useMutation(
    async (customerInfo: any) => {
      try {
        // showNotification({
        // })
        const result = await fetchUtil({
          reqData: [{ ...customerInfo, customerId: userId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/createUserDocument`,
        });
        return result;
      } catch (e) {
        console.error(e);
      }
    },
    {
      onSuccess: async () => {
        // await queryClient.invalidateQueries([USER_DOCUMENT]);
        refetch();
      },
    }
  );
};
