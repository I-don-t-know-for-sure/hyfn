import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useLocation } from '../../../contexts/locationContext/LocationContext';
import { useUser } from '../../../contexts/userContext/User';


import { useInfiniteQuery, useMutation } from 'react-query';

import fetchUtil from '../../../util/fetch';

export const useGetOrderHistory = () => {
  const [location] = useLocation();

  const { userId, userDocument, isLoading, refetch } = useUser();

  return useInfiniteQuery(
    ['orderHistory'],
    async ({ pageParam }) => {
      const result = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/getOrderHistory`,
        reqData: [
          {
            country: location.country,
            customerId: userDocument._id,
            lastDoc: pageParam,
          },
        ],
      });
      console.log(result);

      return result;
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      enabled: !isLoading,
    },
  );
};
