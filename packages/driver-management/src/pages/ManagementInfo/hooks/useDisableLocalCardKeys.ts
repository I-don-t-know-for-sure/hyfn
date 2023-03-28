import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useDisableLocalCardKeys = () => {
  return useMutation(async () => {
    try {
      const result = await fetchUtil({
        reqData: [],
        url: `${import.meta.env.VITE_APP_BASE_URL}/disableLocalCardKeys`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useAddLocalCardKeys.ts:8 ~ returnuseMutation ~ error",
        error
      );
    }
  });
};
