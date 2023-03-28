import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useUpdateManagerInfo = () => {
  return useMutation(
    async (managerInfo: {
      managementName: string;
      managementPhone: string;
      managementAddress: string;
    }) => {
      try {
        const result = await fetchUtil({
          reqData: [managerInfo],
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateManagementInfo`,
        });
        return result;
      } catch (error) {}
    }
  );
};
