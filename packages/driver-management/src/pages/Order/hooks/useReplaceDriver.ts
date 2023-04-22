import { useMutation, useQuery } from "react-query";
import fetchUtil from "utils/fetch";

export const useReplaceDriver = () => {
  return useMutation(
    async ({
      driverId,
      newDriverId,
      orderId,
    }: {
      driverId: string;
      newDriverId: string;
      orderId: string;
    }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ driverId, newDriverId, orderId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/replaceOrderDriver`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useReplaceDriver.ts:8 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
