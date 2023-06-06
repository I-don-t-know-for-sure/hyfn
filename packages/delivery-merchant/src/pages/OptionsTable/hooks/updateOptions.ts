import { randomId } from "@mantine/hooks";

import { t } from "utils/i18nextFix";
import { useMutation } from "react-query";

import { fetchApi } from "utils/fetch";
import { useUser } from "contexts/userContext/User";

export const useUpdateOptions = () => {
  const id = randomId();
  const { userId, userDocument } = useUser();

  return useMutation(async ({ productsArray }: { productsArray: any[] }) => {
    try {
      const validatedProducts = productsArray;
      const { country } = userDocument.storeDoc as { country: string };
      const result = await fetchApi({
        arg: [{ country, productsArray: validatedProducts }],
        url: `updateOptions`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: updateOptions.ts:26 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
