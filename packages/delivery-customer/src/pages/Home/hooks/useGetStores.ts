import { STORES } from "hyfn-types";
import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { useInfiniteQuery, useQuery } from "react-query";

import fetchUtil from "util/fetch";

const useGetStores = ({
  filter,
  nearby,
  city,
}: {
  filter?: any;
  nearby?: boolean;
  city: string;
}) => {
  const [{ coords }] = useLocation();
  const { userDocument } = useUser();
  // const { data } = useRefreshCustomUserData();
  console.log(location);

  return useInfiniteQuery(
    [STORES, nearby, filter, city],
    async ({ pageParam = 0 }) => {
      return await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/getStoreFronts`,
        reqData: [{ coords, nearby, filter, lastDocNumber: pageParam }],
      });
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      enabled: !!userDocument,
    }
  );
};

export default useGetStores;
