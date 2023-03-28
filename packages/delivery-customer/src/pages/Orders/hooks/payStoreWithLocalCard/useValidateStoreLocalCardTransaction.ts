import { useLocation } from '../../../../contexts/locationContext/LocationContext';
import { useMutation, useQueryClient } from 'react-query';

import fetchUtil from '../../../../util/fetch';

export const useValidateStoreLocalCardTransaction = () => {
  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ transactionId }: { transactionId: string }) => {
      return await fetchUtil({
        reqData: [{ transactionId, country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/validateStoreLocalCardTransaction`,
      });
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(['activeOrders']);
      },
    },
  );
};
