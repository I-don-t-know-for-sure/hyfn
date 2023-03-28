import { useMutation } from 'react-query';

import fetchUtil from 'util/fetch';

export const useValidateLocalCardTransaction = () => {
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    return await fetchUtil({
      reqData: [{ transactionId }],

      url: `${import.meta.env.VITE_APP_BASE_URL}/validateLocalCardTransaction`,
    });
  });
};
