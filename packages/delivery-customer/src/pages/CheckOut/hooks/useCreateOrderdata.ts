import { USER_DOCUMENT } from "config/constents";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "util/fetch";

export const useCreateOrderData = () => {
  const queryClient = useQueryClient();

  const [{ coords, address }] = useLocation();
  console.log(address, "ahahahahah");
  const { userId, userDocument, loggedIn, refetch, isLoading } = useUser();

  return useMutation(
    ["orderData"],
    async ({ cart, deliveryDate }: { cart: any[]; deliveryDate: any }) => {
      try {
        // const result = await user.functions.createOrderData([
        //   cart,
        //   { customerId: user.customData._id, customerCoords: coords },
        // ]);

        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/createOrderData`,
          reqData: [
            cart,
            {
              customerId: userDocument._id,
              customerCoords: coords,
              customerAddress: address,
              deliveryDate,
            },
          ],
        });
        refetch();
        return result;
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
