import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useUpdateManagerInfo = () => {
  return useMutation(
    async (managerInfo: {
      managementName: string;
      managementPhone: string;
      managementAddress: string;
    }) => {
      try {
        const result = await fetchApi({
          arg: [managerInfo],
          url: `updateManagementInfo`,
        });
        return result;
      } catch (error) {}
    }
  );
};
