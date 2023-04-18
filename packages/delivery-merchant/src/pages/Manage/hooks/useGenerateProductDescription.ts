import { useUser } from "contexts/userContext/User";
import useUploadImage from "hooks/useUploadImage";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";
import { generateProductDescriptionImageUrl } from "utils/generateProductDescriptionImageUrl";
import { generateProductsUrls } from "utils/generateProductsUrls";

export const useGenerateProductDescription = () => {
  const upload = useUploadImage();
  const { userDocument } = useUser();
  return useMutation(async (products: { images: any; productId: string }[]) => {
    try {
      const productsToBeGenerated = [];
      const images = products.flatMap((product) => {
        return product.images;
      });

      const { generatedURLs, generatedNames } =
        await generateProductDescriptionImageUrl(images);
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const productGeneratedUrLs = [];
        const productGeneratedNames = [];

        for (let x = 0; x < product?.images?.length; x++) {
          productGeneratedNames.push(generatedNames.pop());
          productGeneratedUrLs.push(generatedURLs.pop());
        }
        console.log(
          "🚀 ~ file: useGenerateProductDescription.ts:27 ~ returnuseMutation ~ productGeneratedNames:",
          productGeneratedNames
        );
        productsToBeGenerated.push({
          productId: product.productId,
          imageKeys: productGeneratedNames,
        });

        await upload({
          files: product.images,
          generatedNames: productGeneratedNames,
          generatedURLs: productGeneratedUrLs,
        });
      }
      console.log(
        "🚀 ~ file: useGenerateProductDescription.ts:35 ~ returnuseMutation ~ productsToBeGenerated:",
        productsToBeGenerated
      );
      const result = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/generateDescriptionClient`,
        reqData: [
          { products: productsToBeGenerated, storeId: userDocument?._id },
        ],
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
