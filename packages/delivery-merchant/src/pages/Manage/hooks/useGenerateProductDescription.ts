/* import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useGenerateProductDescription = () => {
  return useMutation(
    async ({ image, productId }: { image: any; productId: string }) => {
      try {
        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/generateDescriptionClient`,
          reqData: [{ image, productId }],
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useGenerateProductDescription.ts:8 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
 */

import useUploadImage from "hooks/useUploadImage";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";
import { generateProductDescriptionImageUrl } from "utils/generateProductDescriptionImageUrl";
import { generateProductsUrls } from "utils/generateProductsUrls";

export const useGenerateProductDescription = () => {
  const upload = useUploadImage();
  return useMutation(
    async ({ images, productId }: { images: any; productId: string }) => {
      try {
        const { generatedURLs, generatedNames } =
          await generateProductDescriptionImageUrl(images);
        await upload({ files: images, generatedNames, generatedURLs });
        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/generateDescriptionClient`,
          reqData: [{ imageKeys: generatedNames, productId }],
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useGenerateProductDescription.ts:8 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
