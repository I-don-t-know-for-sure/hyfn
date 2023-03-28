import { STORES } from 'config/constents';
import { useLocation } from 'contexts/locationContext/LocationContext';
import { useUser } from 'contexts/userContext/User';

import { useInfiniteQuery, useQuery } from 'react-query';

import fetchUtil from 'util/fetch';

const useGetStores = ({ filter, nearby, city }: { filter?: any; nearby?: boolean; city: string }) => {
  const [location] = useLocation();
  const { userDocument } = useUser();
  // const { data } = useRefreshCustomUserData();
  console.log(location);

  return useInfiniteQuery(
    [STORES, nearby, filter, city],
    async ({ pageParam = '' }) => {
      return await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/getStoreFronts`,
        reqData: [{ ...location, nearby }, { filter }, pageParam],
      });
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      enabled: !!userDocument,
    },
  );
};

export default useGetStores;
