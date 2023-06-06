import { useLocation } from "contexts/locationContext/LocationContext";
import { useMutation } from "react-query";
import { fetchApi } from "util/fetch";

export const useReportOrder = () => {
  const [{ country }] = useLocation();

  return useMutation(
    async ({ orderId, report }: { orderId: string; report: any }) => {
      try {
        const result = await fetchApi({
          arg: [{ orderId, report, country }],
          url: `reportOrder`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useReportOrder.ts:8 ~ returnuseMutation ~ error",
          error
        );
      }
    }
  );
};
