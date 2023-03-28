import { useUser } from 'contexts/userContext/User';
import { useMutation, useQueryClient } from 'react-query';

import fetchUtil from 'util/fetch';

export const useCreateLocalCardTransaction = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    async ({ amount }: { amount: number }) => {
      return await fetchUtil({
        reqData: [{ amount, customerId: userDocument._id }],

        url: `${import.meta.env.VITE_APP_BASE_URL}/createLocalCardTransaction`,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions']);
      },
    },
  );
};
