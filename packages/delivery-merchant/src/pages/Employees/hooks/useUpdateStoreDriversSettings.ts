import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useUpdateStoreDriverSettings = () => {
  return useMutation(async () => {
    try {
      // const result = await fetchApi({
      // })
    } catch (error) {
      throw new Error(error);
    }
  });
};
