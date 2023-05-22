import { useInfiniteQuery } from "react-query";
import fetchUtil from "../../../utils/fetch";

export const useGetUnverifiedDrivers = () => {
  return useInfiniteQuery([], async ({ pageParam }) => {
    try {
      const results = await fetchUtil({
        reqData: [{ lastDoc: pageParam }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getUnverifiedDrivers`,
      });
      return results;
    } catch (error) {
      console.error(error);
    }
  });
};
