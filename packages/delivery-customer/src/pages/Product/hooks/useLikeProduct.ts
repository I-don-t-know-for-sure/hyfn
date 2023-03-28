import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useCustomerData } from 'contexts/customerData/CustomerDataProvider';
import { useUser } from 'contexts/userContext/User';
import { t } from 'util/i18nextFix';;
import { useMutation, useQuery } from 'react-query';

import fetchUtil from 'util/fetch';
import Product from '../Product';

export const useLikeProduct = () => {
  const { userId } = useUser();

  const { updateLikes } = useCustomerData();
  const id = randomId();
  return useMutation(
    ['productLike'],
    async (storeInfo: { storeId: string; productId: string; city: string; country: string }) => {
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        });
        updateLikes(storeInfo.storeId, storeInfo.productId);
        const result = await fetchUtil({
          url: import.meta.env.VITE_APP_LIKEPRODUCT,
          reqData: [{ customerId: userId, ...storeInfo }],
        });

        updateNotification({
          message: t('Success'),
          id,
          color: 'green',
          loading: false,
          autoClose: true,
        });

        return result;
      } catch (e) {
        updateLikes(storeInfo.storeId, storeInfo.productId);
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
  );
};
