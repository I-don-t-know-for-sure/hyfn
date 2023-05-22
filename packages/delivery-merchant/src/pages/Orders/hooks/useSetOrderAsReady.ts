import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";

export const useSetOrderAsReady = () => {
  const { userDocument } = useUser();
  return useMutation(
    async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ orderId, storeId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/setOrderAsReady`,
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
