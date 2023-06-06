import { useInfiniteQuery } from "react-query";
import { fetchApi } from "../../../utils/fetch";

export const useGetUnverifiedDrivers = () => {
  return useInfiniteQuery([], async ({ pageParam }) => {
    try {
      const results = await fetchApi({
        arg: [{ lastDoc: pageParam }],
        url: `getUnverifiedDrivers`,
      });
      return results;
    } catch (error) {
      console.error(error);
    }
  });
};
