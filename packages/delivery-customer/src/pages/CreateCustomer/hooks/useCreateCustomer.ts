import { useUser } from "../../../contexts/userContext/User";
import { useMutation } from "react-query";

import { fetchApi } from "../../../util/fetch";

export const useCreateCustomer = () => {
  const { userId, refetch } = useUser();

  return useMutation(
    async (customerInfo: any) => {
      try {
        const result = await fetchApi({
          arg: [{ ...customerInfo, customerId: userId }],
          url: `createUserDocument`,
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
