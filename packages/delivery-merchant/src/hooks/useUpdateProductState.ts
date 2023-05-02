import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

const useUpdateProductState = () => {
  const { userId, userDocument } = useUser();

  const id = randomId();
  return useMutation(async (productId: string) => {
    try {
      const res = fetchUtil({
        reqData: [{ isActive: false }, userDocument?.storeDoc, productId],
        url: `${import.meta.env.VITE_APP_BASE_URL}/updateProductState`,
      });

      return res;
    } catch (error) {
      console.log(
        "🚀 ~ file: useUpdateProductState.ts:22 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};

export default useUpdateProductState;
