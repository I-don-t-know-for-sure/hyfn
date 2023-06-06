import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useUpdateProposal = () => {
  const [{ country }] = useLocation();

  return useMutation(
    async ({ orderId, price }: { orderId: string; price: number }) => {
      try {
        const result = await fetchApi({
          arg: [{ country, orderId, price }],
          url: `updateProposal`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: updateProposal.ts:8 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
