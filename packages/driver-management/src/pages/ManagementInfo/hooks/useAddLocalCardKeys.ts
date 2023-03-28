import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useAddLocalCardKeys = () => {
  return useMutation(
    async (keys: {
      merchantId: string;
      terminalId: string;
      secretKey: string;
    }) => {
      try {
        const result = await fetchUtil({
          reqData: [keys],
          url: `${import.meta.env.VITE_APP_BASE_URL}/addLocalCardKeys`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useAddLocalCardKeys.ts:8 ~ returnuseMutation ~ error",
          error
        );
      }
    }
  );
};
