import useUploadImage from "hooks/useUploadImage";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import { ProductInfo } from "../types";
import { randomId } from "@mantine/hooks";
import fetchUtil from "utils/fetch";
import { t } from "utils/i18nextFix";
import { useUser } from "contexts/userContext/User";

export const useCreateProduct = () => {
  const { userDocument } = useUser();

  const upload = useUploadImage();

  const result = useMutation("product", async (product: ProductInfo) => {
    try {
      const randomid = randomId();
      // const { country, city, id } = user?.customData.storeDoc as {
      //   city: String;
      //   country: string;
      //   id: string;
      // };
      const { files, ...productInfo } = product;
      const imagesURLs = await upload(files);

      const data = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/createProduct`,

        reqData: [
          {
            productInfo: { ...productInfo, imagesURLs },
            creatorId: userDocument.id,
          },
        ],
      });

      // const res = await user?.functions.createProduct([
      //   { ...product, imagesURLs },
      //   user?.customData.storeDoc,
      // ]);

      return data;
    } catch (e) {
      console.error(e);
    }
  });
  return result;
};
