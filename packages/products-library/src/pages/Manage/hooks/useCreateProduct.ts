import useUploadImage from "hooks/useUploadImage";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { showNotification, updateNotification } from "@mantine/notifications";

import { ProductInfo } from "../types";
import { randomId } from "@mantine/hooks";
import fetchUtil from "utils/fetch";
import { t } from 'utils/i18nextFix';
import { useUser } from "contexts/userContext/User";

export const useCreateProduct = () => {
  const { userDocument } = useUser();

  const upload = useUploadImage();

  const result = useMutation("product", async (product: ProductInfo) => {
    try {
      const randomid = randomId();
      showNotification({
        id: randomid,
        title: `creating ${product.textInfo.title}`,
        message: `creating ${product.textInfo.title}`,
        loading: true,
        autoClose: false,
      });
      // const { country, city, id } = user?.customData.storeDoc as {
      //   city: String;
      //   country: string;
      //   id: string;
      // };
      const { files, ...productInfo } = product;
      const imagesURLs = await upload(files);
      console.log(import.meta.env.VITE_APP_CREATE_PRODUCT_IN_LIBRARY);

      const data = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/createProduct`,

        reqData: [
          {
            productInfo: { ...productInfo, imagesURLs },
            creatorId: userDocument._id,
          },
        ],
      });

      // const res = await user?.functions.createProduct([
      //   { ...product, imagesURLs },
      //   user?.customData.storeDoc,
      // ]);

      updateNotification({
        id: randomid,
        title: `${product.textInfo.title} created`,
        message: `${product.textInfo.title} created`,
        loading: false,
        autoClose: 2000,
      });
      return data;
    } catch (e) {
      console.error(e);
    }
  });
  return result;
};
