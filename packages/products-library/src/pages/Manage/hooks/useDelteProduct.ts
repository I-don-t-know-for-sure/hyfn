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
import { t } from 'utils/i18nextFix';
import { useUser } from "contexts/userContext/User";

export const useDeleteProduct = () => {
  const { userDocument } = useUser();

  const queryClient = useQueryClient();
  const notificationId = randomId();
  // const { country, city, id } = user?.customData.storeDoc as {
  //   city: String;
  //   country: string;
  //   id: string;
  // };
  return useMutation(
    "products",
    async ({ productId, title }: { productId: string; title: string }) => {
      try {
        showNotification({
          title: `${t("Deleting")} ${title}`,
          message: t("Deleteing in progress"),
          loading: true,
          id: notificationId,
        });
        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/deleteProduct`,
          reqData: [userDocument._id, productId],
        });
        updateNotification({
          title: `${t("Done")}`,
          message: t("Success"),
          loading: false,
          id: notificationId,
        });
        return result;
      } catch (e) {
        updateNotification({
          title: `${t("Error")}`,
          message: t("An Error occurred"),
          loading: false,
          color: "red",
          id: notificationId,
        });
        console.error(e);
      }
    },
    {
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(["products"]);
      },
    }
  );
};
