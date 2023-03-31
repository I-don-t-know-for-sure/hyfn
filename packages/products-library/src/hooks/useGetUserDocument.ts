import { useQuery } from "react-query";
import fetchUtil from "utils/fetch";

export const useGetUserDocument = ({ userId }: { userId: string }) => {
  // const { userId } = useUser()
  return useQuery([userId], async () => {
    try {
      console.log("shshshshjcdjcbdjcbdhcbhdbchbhd");

      if (!userId) {
        return false;
      }
      const userDoc = await fetchUtil({
        reqData: [{ userId: userId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getCompanyDocument`,
      });

      return userDoc;
    } catch (error) {
      return new Error(error as string);
    }
  });
};