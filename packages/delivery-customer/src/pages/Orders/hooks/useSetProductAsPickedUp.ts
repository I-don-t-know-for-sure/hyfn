import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useLocation } from '../../../contexts/locationContext/LocationContext';
import { useUser } from '../../../contexts/userContext/User';

import { t } from '../../../util/i18nextFix';;
import { useMutation, useQuery, useQueryClient } from 'react-query';
import fetchUtil from '../../../util/fetch';

export const useSetProductAsPickedUp = () => {
  const { userDocument: user } = useUser();

  const [{ country }] = useLocation();
  const queryClient = useQueryClient();
  const id = randomId();
  return useMutation(
    async ({
      storeId,
      productId,
      orderId,
      QTYFound,
    }: {
      storeId: string;
      orderId: string;
      productId: string;
      QTYFound: number;
    }) => {
      try {
        console.log(
          JSON.stringify([
            {
              country,
              storeId,
              productId,
              QTYFound,
              driver: user?._id,
            },
          ]),
        );
        console.log({
          country,
          storeId,
          productId,
          QTYFound,

          driverId: user?._id,
        });
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
              country,
              storeId,
              productId,
              QTYFound,
              orderId,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/setProductAsPickedUp`,
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
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(['activeOrder', user.orderId]);
      },
    },
  );
};
