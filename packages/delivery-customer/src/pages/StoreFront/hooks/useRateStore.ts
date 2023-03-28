import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useCustomerData } from 'contexts/customerData/CustomerDataProvider';
import { useUser } from 'contexts/userContext/User';
import { t } from 'util/i18nextFix';;

import { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';

import fetchUtil from 'util/fetch';

export const useRateStore = () => {
  const { userId, userDocument } = useUser();

  const { updateRatings, cancelRating } = useCustomerData();
  const id = randomId();
  return useMutation(
    ['rating'],
    async ({ storeId, country, rating, city }: { storeId: string; country: string; rating: number; city: string }) => {
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        });
        updateRatings(storeId, rating);

        console.log(import.meta.env.VITE_APP_RATESTORE);

        const result = fetchUtil({
          url: import.meta.env.VITE_APP_RATESTORE,
          reqData: [
            {
              customerId: userDocument.customerId,
              storeId,
              country,
              rating,
              city,
            },
          ],
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
        console.error(e);
        cancelRating(storeId);
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
