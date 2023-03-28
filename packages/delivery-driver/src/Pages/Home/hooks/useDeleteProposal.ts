import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useDeleteProposal = () => {
  const [{ country }] = useLocation();

  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ country, orderId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/deleteProposal`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useCreateProposal.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
