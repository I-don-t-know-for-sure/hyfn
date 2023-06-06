import { collections } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { useQuery } from "react-query";

import { fetchApi } from "utils/fetch";

const useGetCollections = () => {
  const { userId, userDocument } = useUser();

  return useQuery(
    collections,
    async () => {
      const result = await fetchApi({
        url: `getCollectionsForProduct`,
        arg: [userDocument.storeDoc],
      });

      return result;
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetCollections;
