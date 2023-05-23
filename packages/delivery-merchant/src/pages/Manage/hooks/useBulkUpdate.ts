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
import { generateProductsUrls } from "utils/generateProductsUrls";
import { useGenerateProductDescription } from "./useGenerateProductDescription";
import { generateProductDescriptionImageUrl } from "utils/generateProductDescriptionImageUrl";

export const useBulkUpdate = () => {
  const id = randomId();
  const { userId, userDocument } = useUser();
  const { mutate } = useGenerateProductDescription();
  return useMutation(async ({ productsArray }: { productsArray: any[] }) => {
    try {
      const products = productsArray;
      console.log(
        "🚀 ~ file: useBulkUpdate.ts:17 ~ returnuseMutation ~ productsArray:",
        productsArray
      );
      // return;
      // create a function that takes productsArray and maps through it and takes the deletedImages and removeBackgroundImages and generateProductImages key from every object and returns an array of those keys
      const getKeys = (productsArray: any[]) => {
        return productsArray.map((product) => {
          const { files, generateDescriptionImages, id } = product;
          return {
            id,
            files,
            generateDescriptionImages,
          };
        });
      };
      const keysArray = getKeys(productsArray);
      // return;
      var productsToGenerateDescription = [];
      for (let i = 0; i < keysArray.length; i++) {
        const { files, generateDescriptionImages, id } = keysArray[i];
        const upload = useUploadImage();

        if (files?.length > 0) {
          try {
            const { generatedURLs, generatedNames } =
              await generateProductsUrls(files?.length);
            console.log(
              "🚀 ~ file: useBulkUpdate.ts:54 ~ returnuseMutation ~ generatedURLs:",
              generatedURLs
            );

            await upload({
              files,
              generatedNames,
              generatedURLs,
            });
            // loop through products array and and find the product that has theid that matches the product.id and push generatedImages to that product images array
            for (let i = 0; i < products.length; i++) {
              const product = products[i];
              if (product.id === id) {
                product.images = [...product.images, ...generatedNames];
              }
            }
          } catch (error) {
            console.log(
              "🚀 ~ file: useBulkUpdate.ts:51 ~ returnuseMutation ~ error:",
              error
            );
          }
        }
        console.log(
          "🚀 ~ file: useBulkUpdate.ts:17 ~ returnuseMutation ~ productsArray:",
          generateDescriptionImages?.length > 0
        );
        if (generateDescriptionImages?.length > 0) {
          try {
            // const { generatedURLs, generatedNames } =
            //   await generateProductDescriptionImageUrl(
            //     generateDescriptionImages
            //   );
            // // loop through products array and and find the product that has theid that matches the product.id and set description field to ""
            // for (let i = 0; i < products.length; i++) {
            //   const product = products[i];
            //   if (product.id ===id) {
            //     delete product.description;
            //   }
            // }

            // await upload({
            //   files: generateDescriptionImages,
            //   generatedNames,
            //   generatedURLs,
            // });

            productsToGenerateDescription = [
              ...productsToGenerateDescription,
              { images: generateDescriptionImages, productId: id },
            ];
          } catch (error) {
            console.log(
              "🚀 ~ file: useBulkUpdate.ts:66 ~ returnuseMutation ~ error:",
              error
            );
          }
        }
      }
      /*
       * create a function that takes a value and logs it to console
       */
      mutate(productsToGenerateDescription);

      console.log(
        "🚀 ~ file: useBulkUpdate.ts:34 ~ returnuseMutation ~ products:",
        products
      );
      const log = (value: any) => {
        console.log(value);
      };

      const result = await fetchUtil({
        reqData: [{ productsArray: products, storeId: userDocument.id }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/bulkUpdate`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useBulkUpdate.ts:137 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
