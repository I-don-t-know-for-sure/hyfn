import { randomId } from "@mantine/hooks";

import { Store } from "config/types";
import { useUser } from "contexts/userContext/User";
import useUploadImage from "hooks/useUploadImage";
import { t } from "utils/i18nextFix";
import { useMutation, useQuery } from "react-query";

import { fetchApi } from "utils/fetch";
import { generateProductsUrls } from "utils/generateProductsUrls";

export const useUpdateStoreInfo = () => {
  const { userId, userDocument } = useUser();
  const uploadStoreImage = useUploadImage();

  const id = userId;
  const notificationId = randomId();
  return useMutation(["storeInfo", id], async (storeInfo: any) => {
    try {
      const { imageObj, ...store } = storeInfo;

      if (imageObj) {
        const storeFrontImage = storeInfo.imageObj
          ? await uploadImageForStore({
              imageObj: storeInfo.imageObj,
              upload: uploadStoreImage,
            })
          : storeInfo.image;

        const result = await fetchApi({
          url: `updateStoreInfo`,

          arg: [userDocument.storeDoc, { ...store, image: storeFrontImage }],
        });
        return result;
      }
      console.log(`${import.meta.env.VITE_APP_BASE_URL}/updateStoreInfo`);

      const result = await fetchApi({
        url: `updateStoreInfo`,

        arg: [userDocument.storeDoc, { ...store }],
      });

      return result;
    } catch (e) {
      console.error(e);
    }
  });
};

const uploadImageForStore = async ({
  imageObj,
  upload,
}: {
  imageObj: any;
  upload: any;
}) => {
  const { generatedNames, generatedURLs } = await generateProductsUrls(1);
  return await upload({ files: imageObj, generatedNames, generatedURLs });
};
