import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useUser } from 'contexts/userContext/User';
import { t } from 'util/i18nextFix';;
import { Dispatch, SetStateAction } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import fetchUtil from 'util/fetch';

export const useSendOTP = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  const id = randomId();
  return useMutation(
    async (paymentInfo: {
      customerPhone: string;
      birthYear: string;
      OTPSent: Dispatch<SetStateAction<boolean>>;
      amount: any;
    }) => {
      console.log(JSON.stringify([{ customerId: userId, ...paymentInfo }]));
      try {
        showNotification({
          title: t('OTP sent'),
          message: t('check your messages'),
          loading: true,
          autoClose: false,
          id,
        });
        const { OTPSent, amount, ...rest } = paymentInfo;
        const res = await fetchUtil({
          reqData: [{ customerId: userDocument._id, amount: amount, ...rest }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/sendSadadOTP`,
        });
        updateNotification({
          message: t('Success'),
          id,
          color: 'green',
          loading: false,
          autoClose: true,
        });
        OTPSent(true);
        return res;
      } catch (error) {
        console.error(error);
        updateNotification({
          message: t('An Error occurred'),
          id,
          color: 'red',
          loading: false,
          autoClose: true,
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    },
  );
};
