import { useUser } from "contexts/userContext/User";
import { useQuery } from "react-query";

import fetchUtil from "utils/fetch";

const useGetCollections = () => {
  const { userDocument } = useUser();

  return useQuery(
    "collections",
    async () => {
      const result = await fetchUtil({
        url: import.meta.env.VITE_APP_GETCOLLECTIONSFORPRODUCT,
        reqData: [userDocument?.storeDoc],
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
