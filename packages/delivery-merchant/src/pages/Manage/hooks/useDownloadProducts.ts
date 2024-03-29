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

export const useDownlaodProducts = () => {
  const id = randomId();
  const { userId, userDocument } = useUser();

  return useMutation(async () => {
    try {
      const { country } = userDocument.storeDoc as { country: string };

      fetch(`${import.meta.env.VITE_APP_DOWNLOAD_ALL_PRODUCTS}`, {
        method: "POST",
        body: JSON.stringify([{ storeId: userDocument.id, country }]),
      }).then(async (response) => {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", userDocument.id as string);
        document.body.appendChild(link);
        link.click();
      });
      // const result = await fetchApi({
      //   arg: [{ storeId: user.customData.id, country }],
      //   url: import.meta.env.VITE_APP_DOWNLOAD_ALL_PRODUCTS,
      //   user,
      // });

      return "seccess";
    } catch (error) {
      console.log(
        "🚀 ~ file: useDownloadProducts.ts:40 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
