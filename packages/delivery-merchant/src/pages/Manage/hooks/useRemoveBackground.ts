import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useRemoveProductsBackgrounds = () => {
  const { userDocument } = useUser();
  return useMutation(async ({ productIds }: { productIds: any[] }) => {
    try {
      const result = fetchUtil({
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/removeAllProductsBackgrounds`,
        reqData: [{ productIds, storeId: userDocument.id }],
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
