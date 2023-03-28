import { useLocalStorage } from '@mantine/hooks';
import { Auth } from 'aws-amplify';
import { USER_DOCUMENT } from 'config/constents';

import { useUser } from 'contexts/userContext/User';
import { useQuery } from 'react-query';
import fetchUtil from 'util/fetch';

export const useGetUserDocument = ({
  userId,
  setUserDocument,
}: {
  userId: string;
  setUserDocument?: (any: any) => void;
}) => {
  return useQuery([userId], async () => {
    try {
      console.log('shshshshjcdjcbdjcbdhcbhdbchbhd');

      if (!userId) {
        return false;
      }
      const userDoc = await fetchUtil({
        reqData: [userId],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getCustomerData`,
      });
      console.log('🚀 ~ file: useGetUserDocument.ts:21 ~ returnuseQuery ~ userDoc', userDoc);
      if (setUserDocument) {
        setUserDocument(userDoc);
      }
      return userDoc;
    } catch (error) {
      return new Error(error as string);
    }
  });
};
