import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useSetOrderAsPreparing = () => {
  const { userDocument } = useUser();
  return useMutation(
    async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
      const {
        storeDoc: { country },
      } = userDocument;
      try {
        console.log(
          "🚀 ~ file: useSetOrderAsPreparing.ts:10 ~ returnuseMutation ~ country",
          country
        );
        const result = await fetchApi({
          arg: [{ orderId, country, storeId }],
          url: `setOrderAsPreparing`,
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
