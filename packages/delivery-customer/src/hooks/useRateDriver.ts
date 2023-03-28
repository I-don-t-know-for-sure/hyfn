import { useLocation } from 'contexts/locationContext/LocationContext';
import { useUser } from 'contexts/userContext/User';
import { useMutation } from 'react-query';

import fetchUtil from 'util/fetch';

export const useRateDriver = () => {
  const [{ country }] = useLocation();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(['rateDriver'], async ({ newRating, orderId }: { newRating: number; orderId: string }) => {
    return await fetchUtil({
      reqData: [{ country, customerId: userId, newRating, orderId }],
      url: `${import.meta.env.VITE_APP_BASE_URL}/rateDriver`,
    });
  });
};
