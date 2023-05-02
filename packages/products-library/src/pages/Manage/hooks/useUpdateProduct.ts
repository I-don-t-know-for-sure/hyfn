import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import useUploadImage from "hooks/useUploadImage";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";
import { ProductInfo } from "../types";

export const useUpdateProduct = () => {
  const { userDocument } = useUser();

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
        const randomid = randomId();
        const { deletedImages, files, ...rest } = product;
        const imagesURLs = await upload(files);

        const res = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateProduct`,
          reqData: [
            {
              newProductInfo: { ...rest, imagesURLs },
              creatorId: userDocument?._id,
              productId,
              deletedImages,
            },
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
