import useUploadImage from "hooks/useUploadImage";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";
import { generateProductDescriptionImageUrl } from "utils/generateProductDescriptionImageUrl";
import { generateProductsUrls } from "utils/generateProductsUrls";

export const useGenerateProductDescription = () => {
  const upload = useUploadImage();
  return useMutation(async (products: { images: any; productId: string }[]) => {
    try {
      const images = products.flatMap((product) => {
        return product.images;
      });
      console.log(
        "🚀 ~ file: useGenerateProductDescription.ts:37 ~ images ~ images:",
        images
      );
      const { generatedURLs, generatedNames } =
        await generateProductDescriptionImageUrl(images);

      await upload({ files: images, generatedNames, generatedURLs });
      const result = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/generateDescriptionClient`,
        reqData: [{ products }],
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useGenerateProductDescription.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
