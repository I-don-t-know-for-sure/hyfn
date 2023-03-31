import { useLocalStorage } from "@mantine/hooks";
import { Auth } from "aws-amplify";
import { USER_DOCUMENT } from "config/constants";
import { useUser } from "contexts/userContext/User";
import { useQuery } from "react-query";
import fetchUtil from "utils/fetch";

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
        const userDoc = await fetchUtil({
          reqData: [{ userId: userId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getManagement`,
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