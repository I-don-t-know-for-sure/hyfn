import { Auth } from "aws-amplify";
import { useMutation, useQueryClient } from "react-query";
import fetchUtil from "utils/fetch";
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
      // const passportPicKey = await uploadImage([driverInfo.passportPic])
      // const passportAndFacePicKey = await uploadImage([driverInfo.passportAndFacePic])

      await fetchUtil({
        reqData: [{ ...driverInfo }, user.attributes.sub],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createDriverDocument`,
        user,
      });
      refetch();
    } catch (e) {
      console.error(e);
      // if (user) {
      //   await logOut()
      // }
    }
  });
};
