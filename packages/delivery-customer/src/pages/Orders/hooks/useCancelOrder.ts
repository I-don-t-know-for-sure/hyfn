import { useLocation } from 'contexts/locationContext/LocationContext';
import { useMutation } from 'react-query';
import fetchUtil from 'util/fetch';

export const useCancelOrder = () => {
  const [{ country }] = useLocation();
  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ orderId, country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/cancelOrder`,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  });
};
