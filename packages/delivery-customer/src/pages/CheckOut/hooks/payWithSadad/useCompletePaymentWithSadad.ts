import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useUser } from 'contexts/userContext/User';
import { t } from 'util/i18nextFix';;

import { useMutation, useQueryClient } from 'react-query';

import fetchUtil from 'util/fetch';

export const useIncreaseBalanceWithSadad = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  const id = randomId();
  return useMutation(
    async ({ OTP }: { OTP: string }) => {
      try {
        showNotification({
          title: t('payment complete'),
          message: t('your wallet was added x amount'),
          loading: true,
          autoClose: false,
          id,
        });
        console.log(JSON.stringify([{ customerId: userId, OTP }]));

        const res = await fetchUtil({
          reqData: [{ customerId: userId, OTP }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/payWithSadad`,
        });
        updateNotification({
          message: t('Success'),
          id,
          color: 'green',
          loading: false,
          autoClose: true,
        });
        return res;
      } catch (e) {
        updateNotification({
          message: t('An Error occurred'),
          id,
          color: 'red',
          loading: false,
          autoClose: true,
        });
        console.error(e);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    },
  );
};
