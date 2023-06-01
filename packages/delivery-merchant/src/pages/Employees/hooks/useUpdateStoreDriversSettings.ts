import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useUpdateStoreDriverSettings = () => {
  return useMutation(async () => {
    try {
      // const result = await fetchUtil({
      // })
    } catch (error) {
      throw new Error(error);
    }
  });
};
