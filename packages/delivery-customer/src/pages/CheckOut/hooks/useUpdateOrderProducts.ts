import { useCart } from "contexts/cartContext/Provider";

import { useUser } from "contexts/userContext/User";

import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useUpdateOrderProducts = () => {
  const { cart } = useCart();
  const { userId, userDocument, loggedIn, refetch, isLoading } = useUser();

  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      try {
        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}`,
          reqData: [cart, userDocument],
        });
        refetch();
        return result;
      } catch (e) {
        console.error(e);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    }
  );
};
