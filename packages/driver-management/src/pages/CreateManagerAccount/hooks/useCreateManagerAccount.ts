import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useCreateManagerAccount = () => {
  return useMutation(
    async (managerInfo: {
      managementName: string;
      managementPhone: string;
      managementAddress: string;
    }) => {
      try {
        const result = await fetchUtil({
          reqData: [managerInfo],
          url: `${import.meta.env.VITE_APP_BASE_URL}/createManagement`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useCreateManagerAccount.ts:8 ~ returnuseMutation ~ error",
          error
        );
      }
    }
  );
};
