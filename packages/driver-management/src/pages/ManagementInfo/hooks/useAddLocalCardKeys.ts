import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useAddLocalCardKeys = () => {
  return useMutation(
    async (keys: {
      merchantId: string;
      terminalId: string;
      secretKey: string;
    }) => {
      try {
        const result = await fetchApi({
          arg: [{ ...keys, flag: "driverManagements" }],
          url: `addLocalCardPaymentAPIKey`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useAddLocalCardKeys.ts:8 ~ returnuseMutation ~ error",
          error
        );
      }
    }
  );
};
