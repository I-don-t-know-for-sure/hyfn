import { useLocation } from 'contexts/locationContext/LocationContext';
import { useMutation } from 'react-query';
import fetchUtil from 'util/fetch';

export const useSetOrderAsDelivered = () => {
  const [{ country }] = useLocation();
  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ orderId, country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/setOrderAsDelivered`,
      });

      return result;
    } catch (error) {
      console.log('🚀 ~ file: useSetOrderAsDelivered.ts:9 ~ returnuseMutation ~ error', error);
    }
  });
};
