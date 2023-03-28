import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { USER_DOCUMENT } from 'config/constents';
import { useCart } from 'contexts/cartContext/Provider';
import { useLocation } from 'contexts/locationContext/LocationContext';
import { useUser } from 'contexts/userContext/User';
import { t } from 'util/i18nextFix';;
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import fetchUtil from 'util/fetch';

export const useCreateOrderData = () => {
  const queryClient = useQueryClient();

  const id = randomId();
  const [{ coords, address }] = useLocation();
  console.log(address, 'ahahahahah');
  const { userId, userDocument, loggedIn, refetch, isLoading } = useUser();

  return useMutation(
    ['orderData'],
    async ({ cart, deliveryDate }: { cart: any[], deliveryDate: any }) => {
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        });
        // const result = await user.functions.createOrderData([
        //   cart,
        //   { customerId: user.customData._id, customerCoords: coords },
        // ]);
        

        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/createOrderData`,
          reqData: [
            cart,
            {
              customerId: userDocument._id,
              customerCoords: coords,
              customerAddress: address,
              deliveryDate
            },
          ],
        });
        refetch();
        updateNotification({
          message: t('Success'),
          id,
          color: 'green',
          loading: false,
          autoClose: true,
        });
        console.log(result);
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
        queryClient.invalidateQueries([userId, USER_DOCUMENT]);
      },
    },
  );
};
