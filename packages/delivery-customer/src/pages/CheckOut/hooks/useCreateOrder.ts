import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useCart } from 'contexts/cartContext/Provider';
import { useLocation } from 'contexts/locationContext/LocationContext';
import { useUser } from 'contexts/userContext/User';
import { t } from 'util/i18nextFix';;
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import fetchUtil from 'util/fetch';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();
  const { clearCart } = useCart();
  const id = randomId();
  const navigate = useNavigate();

  return useMutation(
    ['order', 'paid'],
    async () => {
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        });
        const result = await fetchUtil({
          reqData: [userDocument._id],
          url: `${import.meta.env.VITE_APP_BASE_URL}/createOrder`,
        });
        updateNotification({
          message: t('Success'),
          id,
          color: 'green',
          loading: false,
          autoClose: true,
        });
        navigate('/');
        //clearCart();
        return result;
      } catch (e) {
        updateNotification({
          message: t('An Error occurred'),
          id,
          color: 'red',
          loading: false,
          autoClose: true,
        });
        console.error(e);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    },
  );
};
