import useUploadImage from "hooks/useUploadImage";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import { ProductInfo } from "../types";
import { randomId } from "@mantine/hooks";
import { fetchApi } from "utils/fetch";
import { t } from "utils/i18nextFix";
import { useUser } from "contexts/userContext/User";
import { generateProductsUrls } from "utils/generateProductsUrls";

export const useCreateProduct = () => {
  const { userId, userDocument } = useUser();

  const upload = useUploadImage();

  const result = useMutation(
    "product",
    async ({ productLibraryImages, ...product }: ProductInfo) => {
      try {
        const randomid = randomId();
        //const { country, city, id } = user?.customData.storeDoc as {
        //city: String;
        //country: string;
        //   id: string;
        // };

        const { generatedNames, generatedURLs } = await generateProductsUrls(
          product?.files?.length
        );
        const imagesURLs = await upload({
          files: product?.files,
          generatedNames,
          generatedURLs,
        });
        const libraryImages = Array.isArray(productLibraryImages)
          ? productLibraryImages
          : [];

        const data = await fetchApi({
          url: `createProduct`,

          arg: [
            {
              ...product,
              imagesURLs: [...imagesURLs, ...libraryImages],
            },
            userDocument?.storeDoc,
            userId,
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
    }
  );
  return result;
};
