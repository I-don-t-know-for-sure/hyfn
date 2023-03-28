import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useUpdateProposal = () => {
  const [{ country }] = useLocation();

  return useMutation(
    async ({ orderId, price }: { orderId: string; price: number }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ country, orderId, price }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateProposal`,
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
