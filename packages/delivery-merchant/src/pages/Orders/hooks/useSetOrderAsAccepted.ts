import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useSetOrderAsAccepted = () => {
  const { userDocument } = useUser();

  return useMutation(
    async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
      try {
        const result = fetchApi({
          arg: [{ orderId, storeId }],
          url: `setOrderAsAccepted`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useSetOrderAsAccepted.ts:8 ~ returnuseMutation ~ error",
          error
        );
        throw new Error("error");
      }
    }
  );
};
