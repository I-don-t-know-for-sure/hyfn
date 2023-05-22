import { useMutation } from "react-query";
import fetchUtil from "../../../utils/fetch";

export const useVerifyDriverManagement = () => {
  return useMutation(
    async ({ driverManagement }: { driverManagement: string }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ driverManagement }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/verifyDriverManagement`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  );
};
