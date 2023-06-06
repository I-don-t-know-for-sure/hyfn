import { useMutation } from "react-query";
import { fetchApi } from "../../../utils/fetch";

export const useRemoveDriverManagementVerification = () => {
  return useMutation(
    async ({ driverManagement }: { driverManagement: string }) => {
      try {
        const result = await fetchApi({
          arg: [{ driverManagement }],
          url: `${
            import.meta.env.VITE_APP_BASE_URL
          }/removeDriverManagementVerification`,
        });
        return result;
      } catch (error) {
        console.error(error);
      }
    }
  );
};
