import { useUser } from 'contexts/userContext/User';
import { useMutation, useQuery } from 'react-query';
import fetchUtil from 'util/fetch';

export const useRefreshBalance = () => {
  const { userId, setUserDocument, userDocument } = useUser();
  return useQuery(
    [],
    async () => {
      try {
        if (!userId) {
          return;
        }
        const result = await fetchUtil({
          reqData: [{ userId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/refreshBalance`,
        });
        setUserDocument({ ...userDocument, balance: result });
        return result;
      } catch (error) {
        console.log('🚀 ~ file: useRefreshBalance.ts:8 ~ returnuseMutation ~ error', error);
      }
    },
    {
      refetchOnWindowFocus: true,
    },
  );
};
