import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useSetOrderAsReady = () => {
  const { userDocument } = useUser();
  return useMutation(
    async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
      try {
        const result = await fetchApi({
          arg: [{ orderId, storeId }],
          url: `setOrderAsReady`,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: useSetOrderAsPreparing.ts:8 ~ returnuseMutation ~ error",
          error
        );
      }
    }
  );
};
