import { useLocation } from 'contexts/locationContext/LocationContext';
import { useMutation } from 'react-query';
import fetchUtil from 'util/fetch';

export const useReportOrder = () => {
  const [{ country }] = useLocation();

  return useMutation(async ({ orderId, report }: { orderId: string; report: any }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ orderId, report, country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/reportOrder`,
      });
      return result;
    } catch (error) {
      console.log('🚀 ~ file: useReportOrder.ts:8 ~ returnuseMutation ~ error', error);
    }
  });
};
