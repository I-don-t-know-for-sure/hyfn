import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

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
        const result = await fetchUtil({
          reqData: [{ country, driverId, orderId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/acceptProposal`,
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
