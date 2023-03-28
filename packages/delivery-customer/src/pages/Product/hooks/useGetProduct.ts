import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { PRODUCT } from 'config/constents';
import { useCustomerData } from 'contexts/customerData/CustomerDataProvider';
import { t } from 'util/i18nextFix';;
import { useMutation, useQuery } from 'react-query';

import fetchUtil from 'util/fetch';
import Product from '../Product';

export const useGetProduct = (
  locationInfo: {
    storefront: string;
    city: string;
    country: string;
    productId: string;
  },
  withStoreDoc: boolean,
) => {
  return useQuery(
    [PRODUCT, locationInfo.productId],
    async () => {
      try {
        return await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/getProduct`,
          reqData: [locationInfo, withStoreDoc],
        });
      } catch (e) {
        console.error(e);
      }
    },
    {},
  );
};
