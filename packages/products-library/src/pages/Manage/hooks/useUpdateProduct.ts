import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
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
        showNotification({
          id: randomid,
          title: `updating ${product.textInfo.title}`,
          message: `updating ${product.textInfo.title}`,
          loading: true,
          autoClose: false,
        });
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
        updateNotification({
          id: randomid,
          title: `${product.textInfo.title} updated`,
          message: `${product.textInfo.title} updated`,
          loading: false,
          autoClose: 2000,
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
