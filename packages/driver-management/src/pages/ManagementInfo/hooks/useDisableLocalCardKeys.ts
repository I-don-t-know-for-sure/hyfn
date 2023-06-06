import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useDisableLocalCardKeys = () => {
  return useMutation(async () => {
    try {
      const result = await fetchApi({
        arg: [],
        url: `deleteLocalCardAPIKey`,
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
