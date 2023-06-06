import { useMutation } from "react-query";
import { fetchApi } from "../../../utils/fetch";

export const useSetDriverAsVerified = () => {
  return useMutation(async ({ driverId }: { driverId: string }) => {
    try {
      const result = fetchApi({
        arg: [{ driverId }],
        url: `setDriverAsVerified`,
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  });
};
