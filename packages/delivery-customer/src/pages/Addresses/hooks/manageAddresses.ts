import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useUser } from '../../../contexts/userContext/User';
import { t } from '../../../util/i18nextFix';;
import { useMutation, useQueryClient } from 'react-query';

import fetchUtil from '../../../util/fetch';

export const useManageAddresses = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  const id = randomId();
  return useMutation(
    async ({ addresses }: { addresses: any[] }) => {
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        });
        const result = await fetchUtil({
          reqData: [{ addresses, customerId: userDocument._id }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateAddresses`,
        });

        updateNotification({
          message: t('Success'),
          id,
          color: 'green',
          loading: false,
          autoClose: true,
        });
        return result;
      } catch (error) {
        updateNotification({
          message: t('An Error occurred'),
          id,
          color: 'red',
          loading: false,
          autoClose: true,
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    },
  );
};
