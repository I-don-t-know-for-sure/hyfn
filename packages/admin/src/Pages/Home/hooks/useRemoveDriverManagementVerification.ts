import { useMutation } from "react-query";
import fetchUtil from "../../../utils/fetch";

export const useRemoveDriverManagementVerification = () => {
  return useMutation(
    async ({ driverManagement }: { driverManagement: string }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ driverManagement }],
          url: `${
            import.meta.env.VITE_APP_BASE_URL
          }/removeDriverManagementVerification`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useVerifyDriverManagement.ts:8 ~ returnuseMutation ~ error",
          error
        );
      }
    }
  );
};
