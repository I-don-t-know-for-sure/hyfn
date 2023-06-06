import { Auth } from "aws-amplify";
import { useMutation, useQueryClient } from "react-query";
import { fetchApi } from "utils/fetch";
import useUploadImage from "./useUploadImage";
import { useUser } from "contexts/userContext/User";
import { log } from "console";

export const useCreateDriver = () => {
  // const uploadImage = useUploadImage()
  const queryClient = useQueryClient();
  const { refetch } = useUser();
  return useMutation(async (driverInfo: any) => {
    try {
      const user = await Auth.currentUserInfo();

      await fetchApi({
        arg: [{ ...driverInfo }, user.attributes.sub],
        url: `createDriverDocument`,
      });
      refetch();
    } catch (e) {
      console.error(e);
    }
  });
};
