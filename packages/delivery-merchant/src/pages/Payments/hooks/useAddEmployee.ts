import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useAddEmployee = () => {
  return useMutation(async ({ employeeId }: { employeeId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ employeeId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/addEmployee`,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: useAddEmployee.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
