import { USER_DOCUMENT } from "hyfn-types";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";
import { useMutation, useQueryClient } from "react-query";

import { fetchApi } from "util/fetch";
import { useNavigate } from "react-router-dom";

export const useCreateOrderData = () => {
  const queryClient = useQueryClient();

  const [{ coords, address }] = useLocation();
  const navigate = useNavigate();

  const { userId, userDocument, loggedIn, refetch, isLoading } = useUser();

  return useMutation(
    ["orderData"],
    async ({ cart, deliveryDate }: { cart: any[]; deliveryDate: any }) => {
      try {
        // const result = await user.functions.createOrderData([
        //   cart,
        //   { customerId: user.customData.id, customerCoords: coords },
        // ]);

        const result = await fetchApi({
          url: `createOrderData`,
          arg: [
            cart,
            {
              customerId: userDocument.id,
              customerCoords: coords,
              customerAddress: address,
              deliveryDate,
            },
          ],
        });
        refetch();
        navigate("/", { replace: true });
        console.log(result);
      } catch (e) {
        console.error(e);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId, USER_DOCUMENT]);
      },
    }
  );
};
