import { useLocation } from 'contexts/locationContext/LocationContext';
import { useUser } from 'contexts/userContext/User';
import { useMutation } from 'react-query';
import fetchUtil from 'util/fetch';

export const usePayServiceFee = () => {
  const [{ country }] = useLocation();

  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ orderId, country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/payServiceFee`,
      });
      return result;
    } catch (error) {
      console.log('🚀 ~ file: usePayServiceFee.ts:8 ~ returnuseMutation ~ error', error);
    }
  });
};
