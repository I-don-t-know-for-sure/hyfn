import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useUpdateOrderSettings = () => {
 return useMutation(async ({acceptPickupOrders,acceptDeliveryOrders}:{acceptDeliveryOrders: boolean, acceptPickupOrders: boolean}) => {
    const result = await fetchApi({
url:'updateOrderSettings',
      arg: [{
acceptDeliveryOrders,
        acceptPickupOrders
      }]
    })
  });
};
