import { useCart } from "contexts/cartContext/Provider";
import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import fetchUtil from "util/fetch";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();
  const { clearCart } = useCart();

  const navigate = useNavigate();

  return useMutation(
    ["order", "paid"],
    async () => {
      try {
        const result = await fetchUtil({
          reqData: [userDocument.id],
          url: `${import.meta.env.VITE_APP_BASE_URL}/createOrder`,
        });
        navigate("/");
        //clearCart();
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
