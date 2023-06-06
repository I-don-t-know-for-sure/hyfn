import { useQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetUserDocument = ({ userId }: { userId: string }) => {
  // const { userId } = useUser()
  return useQuery(
    [userId],
    async () => {
      try {
        console.log("shshshshjcdjcbdjcbdhcbhdbchbhd");

        if (!userId) {
          return false;
        }
        const userDoc = await fetchApi({
          arg: [{ userId: userId }],
          url: `getManagement`,
        });

        return userDoc;
      } catch (error) {
        return new Error(error as string);
      }
    },
    {
      staleTime: 300000,
      cacheTime: 350000,
    }
  );
};
