import { USER_DOCUMENT } from "hyfn-types";
import { useMutation, useQueryClient } from "react-query";

import { fetchApi } from "utils/fetch";

export const useAddLocalCardAPIKeys = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (localCardAPIKey: {
      MerchantId: string;
      TerminalId: string;
      secretKey: string;
    }) => {
      return await fetchApi({
        arg: [
          {
            merchantId: localCardAPIKey.MerchantId,
            terminalId: localCardAPIKey.TerminalId,
            secretKey: localCardAPIKey.secretKey,
          },
        ],
        url: `addLocalCardPaymentAPIKey`,
      });
    },
    {
      async onSuccess(data, variables, context) {
        await queryClient.invalidateQueries([USER_DOCUMENT]);
      },
    }
  );
};
