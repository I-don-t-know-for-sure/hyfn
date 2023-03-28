import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useLocation } from '../../../contexts/locationContext/LocationContext';

import { t } from '../../../util/i18nextFix';;

import { useInfiniteQuery, useMutation } from 'react-query';

import fetchUtil from '../../../util/fetch';

export const useSetOrderToPickup = () => {
  const [{ country }] = useLocation();

  const id = randomId();
  return useMutation(['setOrdertoPickup'], async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
    try {
      console.log(JSON.stringify([{ country, orderId, storeId }]));
      showNotification({
        title: t('In progress'),
        message: t('Processing'),
        loading: true,
        autoClose: false,
        id,
      });
      const result = await fetchUtil({
        reqData: [{ country, orderId, storeId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/setStoreToPickup`,
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
  });
};
