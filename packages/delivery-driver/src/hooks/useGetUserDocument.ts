import { useQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetUserDocument = ({ userId }: { userId: string }) => {
  // const { userId } = useUser()
  return useQuery(
    [userId],
    async () => {
      try {
        console.log(userId);

        if (!userId) {
          return false;
        }
        const userDoc = await fetchApi({
          arg: [{ userId: userId }],
          url: `getDriverDocument`,
        });

        return userDoc;
      } catch (error) {
        return new Error(error as string);
      }
    },
    {}
  );
};
