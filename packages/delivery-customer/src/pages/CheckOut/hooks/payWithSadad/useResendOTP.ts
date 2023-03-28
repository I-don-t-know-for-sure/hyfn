import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useUser } from 'contexts/userContext/User';
import { t } from 'util/i18nextFix';;
import { Dispatch, SetStateAction } from 'react';

import { useMutation } from 'react-query';

import fetchUtil from 'util/fetch';

export const useResendOTP = () => {
  const { userId, userDocument, isLoading, refetch } = useUser();

  const id = randomId();
  return useMutation(async ({ OTPSent }: { OTPSent: Dispatch<SetStateAction<boolean>> }) => {
    try {
      showNotification({
        title: t('OTP was resent'),
        message: t('check your messages'),
        loading: true,
        autoClose: false,
        id,
      });
      const res = await fetchUtil({
        reqData: [{ customerId: userId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/resendSadadOTP`,
      });
      updateNotification({
        message: t('Success'),
        id,
        color: 'green',
        loading: false,
        autoClose: true,
      });
      return res;
    } catch (error) {
      updateNotification({
        message: t('An Error occurred'),
        id,
        color: 'red',
        loading: false,
        autoClose: true,
      });
      OTPSent(false);
      console.error(error);
    }
  });
};
