import { useMutation } from "react-query";
import fetchUtil from "../../../utils/fetch";

export const useSetDriverAsVerified = () => {
  return useMutation(async ({ driverId }: { driverId: string }) => {
    try {
      const result = fetchUtil({
        reqData: [{ driverId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/setDriverAsVerified`,
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  });
};
