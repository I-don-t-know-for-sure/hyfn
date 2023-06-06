import { useMutation } from "react-query";
import { fetchApi } from "../../../utils/fetch";

export const useVerifyDriverManagement = () => {
  return useMutation(
    async ({ driverManagement }: { driverManagement: string }) => {
      try {
        const result = await fetchApi({
          arg: [{ driverManagement }],
          url: `verifyDriverManagement`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  );
};
