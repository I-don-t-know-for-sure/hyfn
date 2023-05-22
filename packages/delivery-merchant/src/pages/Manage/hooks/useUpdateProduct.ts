import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import useUploadImage from "hooks/useUploadImage";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";
import { ProductInfo } from "../types";
import { generateProductsUrls } from "utils/generateProductsUrls";

export const useUpdateProduct = () => {
  const { userId, userDocument } = useUser();

  // const { country, city, id } = user?.customData.storeDoc as {
  //   city: String;
  //   country: string;
  //   id: string;
  // };
  const queryClient = useQueryClient();
  const upload = useUploadImage();
  return useMutation(
    "products",
    async ({
      productId,
      product,
    }: {
      product: ProductInfo;
      productId: string;
    }) => {
      try {
        console.log(product.productLibraryImages);

        const randomid = randomId();

        const { deletedImages, productLibraryImages = [], ...rest } = product;
        if (product?.files?.length > 0) {
          const { generatedNames, generatedURLs } = await generateProductsUrls(
            product?.files?.length
          );
          var imagesURLs = await upload({
            files: product?.files,
            generatedNames,
            generatedURLs,
          });

          console.log([
            { ...rest, imagesURLs: [...imagesURLs, ...productLibraryImages] },
            userDocument?.storeDoc,
            productId,
            deletedImages,
          ]);
        }
        const res = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateProduct`,
          reqData: [
            {
              product: {
                ...rest,
                imagesURLs: [
                  ...(imagesURLs?.length > 0 ? imagesURLs : []),
                  ...productLibraryImages,
                ],
              },
              deletedImages,
              productId,
            },
            // userDocument?.storeDoc,
          ],
        });

        return res;
      } catch (e) {
        console.error(e);
      }
    },
    {
      async onSettled(data, error, variables, context) {
        await queryClient.invalidateQueries([
          "products",
          "product",
          variables.productId,
        ]);
      },
    }
  );
};
