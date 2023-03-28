import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useLocation } from 'contexts/locationContext/LocationContext';
import { useUser } from 'contexts/userContext/User';
import { t } from 'util/i18nextFix';;
import { useMutation } from 'react-query';

import fetchUtil from 'util/fetch';

export const useConfirmOrderDelivery = () => {
  const [{ country }] = useLocation();
  const { userId, userDocument, isLoading, refetch } = useUser();

  const id = randomId();
  return useMutation(
    ['confrimOrderDelivery'],
    async ({
      orderId,

      newRating,
    }: {
      orderId: string;

      newRating: number;
    }) => {
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        });
        const result = await fetchUtil({
          reqData: [{ country, orderId, customerId: userDocument._id }, { newRating }],
          url: import.meta.env.VITE_APP_CONFIRM_ORDER_DELIVERY,
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
  );
};
