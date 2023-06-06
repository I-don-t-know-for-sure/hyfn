import { useUser } from "contexts/userContext/User";

import { useMutation, useQuery } from "react-query";

import { fetchApi } from "utils/fetch";

const useGetStoreInfo = () => {
  const { userId, userDocument } = useUser();

  const storeDoc = userDocument?.storeDoc as { id: string };
  const id = storeDoc ? storeDoc.id : "noid";

  return useQuery(
    [id],
    async () => {
      try {
        return await fetchApi({
          url: `getStoreDocument`,
          arg: [{ userId }],
        });
      } catch (e) {
        console.error(e);
      }
    },
    {
      staleTime: 20000,
      cacheTime: 30000,
    }
  );
};

export default useGetStoreInfo;
