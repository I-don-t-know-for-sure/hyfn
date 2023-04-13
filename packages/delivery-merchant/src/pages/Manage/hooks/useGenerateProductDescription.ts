import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useGenerateProductDescription = () => {
  return useMutation(
    async ({ image, productId }: { image: any; productId: string }) => {
      try {
        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/generateDescriptionClient`,
          reqData: [{ image, productId }],
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useGenerateProductDescription.ts:8 ~ returnuseMutation ~ error:",
          error
        );
      }
    }
  );
};
