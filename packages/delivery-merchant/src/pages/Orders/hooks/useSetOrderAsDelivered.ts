import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useSetOrderAsDelivered = () => {
  const { userDocument } = useUser();
  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const country = userDocument?.storeDoc.country;
      const result = await fetchApi({
        arg: [{ country, orderId }],
        url: `setOrderAsDelivered`,
      });
      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useSetOrderAsDelivered.ts:10 ~ returnuseMutation ~ error",
        error
      );
    }
  });
};
