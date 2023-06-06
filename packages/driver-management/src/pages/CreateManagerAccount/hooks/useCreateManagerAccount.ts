import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useCreateManagerAccount = () => {
  return useMutation(
    async (managerInfo: {
      managementName: string;
      managementPhone: string;
      managementAddress: string;
    }) => {
      try {
        const result = await fetchApi({
          arg: [managerInfo],
          url: `createManagement`,
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
