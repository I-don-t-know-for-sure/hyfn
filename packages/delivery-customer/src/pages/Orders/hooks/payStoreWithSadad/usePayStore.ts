import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useLocation } from 'contexts/locationContext/LocationContext';
import { useUser } from 'contexts/userContext/User';
import { t } from 'util/i18nextFix';;
import { useMutation, useQueryClient } from 'react-query';

import fetchUtil from 'util/fetch';

export const usePayStore = () => {
  const { userId, userDocument } = useUser();

  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ storeId, orderId }: { storeId: string; orderId: string }) => {
      const id = randomId();
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        });

        const result = await fetchUtil({
          reqData: [
            {
              storeId,
              orderId,
              country,
              customerId: userDocument?._id,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/payStoreWithSadad`,
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
