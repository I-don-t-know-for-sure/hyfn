import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useLocation } from '../../../contexts/locationContext/LocationContext';

import { t } from '../../../util/i18nextFix';;

import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';

import fetchUtil from 'util/fetch';

export const useCancelStore = () => {
  const [{ country }] = useLocation();

  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    ['cancelOrder'],
    async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        });
        const result = await fetchUtil({
          reqData: [{ country, orderId, storeId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/cancelStore`,
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
        queryClient.invalidateQueries(['activeOrders']);
      },
    },
  );
};
