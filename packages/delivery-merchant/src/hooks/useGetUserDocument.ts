import { storeAppText } from "hyfn-types";
import { t } from "utils/i18nextFix";
import { useQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetUserDocument = ({ userId }: { userId: string }) => {
  // const { userId } = useUser()
  return useQuery(
    [userId],
    async () => {
      try {
        if (!userId) {
          // return false;
          throw new Error(t(storeAppText["user id not found"]));
        }
        // const userDoc = await fetchUtil({
        //   reqData: [{ userId: userId }],
        //   url: `${import.meta.env.VITE_APP_BASE_URL}/getStoreDocument`,
        // });

        const userDoc = await fetchApi({
          url: "getStoreDocument",
          arg: [{ userId: userId }],
        });

        return userDoc;
      } catch (error) {
        throw new Error(error as string);
      }
    },
    {
      staleTime: 300000,
      cacheTime: 350000,
    }
  );
};
