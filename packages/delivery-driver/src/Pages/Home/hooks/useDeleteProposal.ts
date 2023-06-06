import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useDeleteProposal = () => {
  const [{ country }] = useLocation();

  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ country, orderId }],
        url: `deleteProposal`,
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
