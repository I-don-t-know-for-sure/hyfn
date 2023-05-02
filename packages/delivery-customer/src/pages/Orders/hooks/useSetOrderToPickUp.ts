import { randomId } from "@mantine/hooks";

import { useLocation } from "../../../contexts/locationContext/LocationContext";

import { useInfiniteQuery, useMutation } from "react-query";

import fetchUtil from "../../../util/fetch";

export const useSetOrderToPickup = () => {
  const [{ country }] = useLocation();

  const id = randomId();
  return useMutation(
    ["setOrdertoPickup"],
    async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
      try {
        console.log(JSON.stringify([{ country, orderId, storeId }]));

        const result = await fetchUtil({
          reqData: [{ country, orderId, storeId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/setStoreToPickup`,
        });

        return result;
      } catch (error) {}
    }
  );
};
