import { useMutation } from "react-query";
import { fetchApi } from "util/fetch";

export const useAcceptProposal = () => {
  return useMutation(
    async ({
      country,
      driverId,
      orderId,
    }: {
      country: string;
      driverId: string;
      orderId: string;
    }) => {
      try {
        const result = await fetchApi({
          arg: [{ country, driverId, orderId }],
          url: `acceptProposal`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useAcceptProposal.ts:10 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
