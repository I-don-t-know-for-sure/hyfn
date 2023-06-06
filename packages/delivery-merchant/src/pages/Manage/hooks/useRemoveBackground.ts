import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useRemoveProductsBackgrounds = () => {
  const { userDocument } = useUser();
  return useMutation(async ({ productIds }: { productIds: any[] }) => {
    try {
      const result = fetchApi({
        url: `removeAllProductsBackgrounds`,
        arg: [{ productIds, storeId: userDocument.id }],
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
