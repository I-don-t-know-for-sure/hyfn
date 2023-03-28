import { useQuery } from "react-query";
import fetchUtil from "utils/fetch";

export const useTestQuery = () => {
  return useQuery([], async () => {
    try {
      const result = await fetchUtil({
        reqData: [{}],
        url: `${import.meta.env.VITE_APP_BASE_URL}/checkQuery`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useTestQuery.ts:8 ~ returnuseQuery ~ error:",
        error
      );
    }
  });
};
