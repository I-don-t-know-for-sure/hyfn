import { useMutation, useQuery } from "react-query";
import { fetchApi } from "utils/fetch";

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
        const result = await fetchApi({
          arg: [{ driverId, newDriverId, orderId }],
          url: `replaceOrderDriver`,
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
