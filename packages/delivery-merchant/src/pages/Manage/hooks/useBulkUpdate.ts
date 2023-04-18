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
      showNotification({
        title: t("inserting new products"),
        message: t("In progress"),
        id,
        loading: true,
        autoClose: false,
      });
      const products = productsArray;
      console.log(
        "🚀 ~ file: useBulkUpdate.ts:17 ~ returnuseMutation ~ productsArray:",
        productsArray
      );
      // return;
      // create a function that takes productsArray and maps through it and takes the deletedImages and removeBackgroundImages and generateProductImages key from every object and returns an array of those keys
      const getKeys = (productsArray: any[]) => {
        return productsArray.map((product) => {
          const { files, generateDescriptionImages, _id } = product;
          return {
            _id,
            files,
            generateDescriptionImages,
          };
        });
      };
      const keysArray = getKeys(productsArray);
      // return;
      var productsToGenerateDescription = [];
      for (let i = 0; i < keysArray.length; i++) {
        const { files, generateDescriptionImages, _id } = keysArray[i];
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
            // loop through products array and and find the product that has the _id that matches the product._id and push generatedImages to that product images array
            for (let i = 0; i < products.length; i++) {
              const product = products[i];
              if (product._id === _id) {
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

        if (generateDescriptionImages?.length > 0) {
          try {
            // const { generatedURLs, generatedNames } =
            //   await generateProductDescriptionImageUrl(
            //     generateDescriptionImages
            //   );
            // // loop through products array and and find the product that has the _id that matches the product._id and set description field to ""
            // for (let i = 0; i < products.length; i++) {
            //   const product = products[i];
            //   if (product._id === _id) {
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
              { images: generateDescriptionImages, productId: _id },
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
      const { country } = userDocument.storeDoc as { country: string };
      const result = await fetchUtil({
        reqData: [
          { country, productsArray: products, storeId: userDocument._id },
        ],
        url: `${import.meta.env.VITE_APP_BASE_URL}/bulkUpdate`,
      });

      updateNotification({
        title: t("Products were added successfully"),
        message: t("Successful"),
        id,
        loading: false,
        autoClose: true,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useBulkUpdate.ts:137 ~ returnuseMutation ~ error:",
        error
      );
      updateNotification({
        title: t("Error"),
        message: t("An Error occurred"),
        id,
        autoClose: true,
        color: "red",
      });
    }
  });
};
