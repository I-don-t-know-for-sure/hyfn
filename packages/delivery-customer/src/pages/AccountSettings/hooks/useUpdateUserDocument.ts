import { randomId } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useUser } from '../../../contexts/userContext/User';
import { t } from 'util/i18nextFix';;
import { useMutation, useQueryClient } from 'react-query';

import fetchUtil from 'util/fetch';

const useUpdateUserDocument = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  const id = randomId();
  return useMutation(
    async ({ newUserInfo }: { newUserInfo: any }) => {
      try {
        showNotification({
          id,
          message: t('updating user info'),
          title: t('In Progress'),
          loading: true,
          autoClose: false,
        });
        const userDocExist = Object.keys(userDocument).length > 0;

        const result = userDocExist
          ? await fetchUtil({
              reqData: [userDocument?._id, newUserInfo],

              url: `${import.meta.env.VITE_APP_BASE_URL}/updateUserDocument`,
            })
          : console.log('shshshsh');
        updateNotification({
          id,
          message: t('User info successfully updated'),
          title: t('Successful'),
          loading: false,
          autoClose: true,
          color: 'green',
        });
        return result;
      } catch (error) {
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

export default useUpdateUserDocument;
