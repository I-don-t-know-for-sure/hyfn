import { useMutation } from "react-query";
import fetchUtil from "util/fetch";

export const useTestNewDb = () => {
  return useMutation(async () => {
    try {
      const result = await fetchUtil({
        reqData: [{}],
        url: `${import.meta.env.VITE_APP_BASE_URL}/testNewDb`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useTestNewDb.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
