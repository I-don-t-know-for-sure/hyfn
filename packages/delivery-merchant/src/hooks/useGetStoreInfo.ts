import { useUser } from "contexts/userContext/User";

import { useMutation, useQuery } from "react-query";

import fetchUtil from "utils/fetch";

const useGetStoreInfo = () => {
  const { userId, userDocument } = useUser();

  const storeDoc = userDocument?.storeDoc as { id: string };
  const id = storeDoc ? storeDoc.id : "noid";

  return useQuery(
    [id],
    async () => {
      try {
        return userId
          ? await fetchUtil({
              url: `${import.meta.env.VITE_APP_BASE_URL}/getStoreDocument`,
              reqData: [{ userId }],
            })
          : {};
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
