import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useRemoveProductsBackgrounds = () => {
  return useMutation(async ({ productIds }: { productIds: any[] }) => {
    try {
      const result = fetchUtil({
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/removeAllProductsBackgrounds`,
        reqData: [{ productIds }],
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useRemoveBackground.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
