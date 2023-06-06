import { Auth } from "aws-amplify";
import { useUser } from "contexts/userContext/User";
import { useGetUserDocument } from "hooks/useGetUserDocument";
import { useMutation, useQueryClient } from "react-query";
import { fetchApi } from "utils/fetch";

export const useCreateDriver = () => {
  // const { user, logOut } = useRealmApp()
  const { userId, refetch } = useUser();
  const queryClient = useQueryClient();
  return useMutation(
    async (driverInfo: any) => {
      try {
        fetchApi({
          arg: [driverInfo, userId],
          url: `createDriverDocument`,
        });
        refetch();
      } catch (e) {
        console.error(e);
        // if (user) {
        //   await logOut()
        // }
      }
    }
    // {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries([userId])
    //   },
    // },
  );
};
