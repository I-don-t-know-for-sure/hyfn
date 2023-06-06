import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";

import useUploadImage from "hooks/useUploadImage";
import { t } from "utils/i18nextFix";
import { useMutation, useQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useUpdateDriverDocument = () => {
  const { userDocument: user } = useUser();
  const uploadImage = useUploadImage();

  const id = randomId();
  // const uploadImage = useUploadImage();
  return useMutation(async (driverInfo: any) => {
    try {
      console.log(
        "🚀 ~ file: useUpdateDriverDocument.ts:18 ~ returnuseMutation ~ driverInfo",
        driverInfo
      );

      const passportPicKey = Array.isArray(driverInfo.passportPic)
        ? driverInfo.passportPic
        : await uploadImage([driverInfo.passportPic]);
      const passportAndFacePicKey = Array.isArray(driverInfo.passportAndFacePic)
        ? driverInfo.passportAndFacePic
        : await uploadImage([driverInfo.passportAndFacePic]);

      const result = await fetchApi({
        arg: [
          user?.id,
          {
            ...driverInfo,
            passportAndFacePic: passportAndFacePicKey,
            passportPic: passportPicKey,
          },
        ],
        url: `updateDriverDocument`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useUpdateDriverDocument.ts:37 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
