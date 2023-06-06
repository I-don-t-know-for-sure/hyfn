import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useAddEmployee = () => {
  return useMutation(async ({ employeeId }: { employeeId: string }) => {
    try {
      const result = await fetchApi({
        arg: [{ employeeId }],
        url: `addEmployee`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useAddEmployee.ts:8 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
