import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useResendOTP = () => {
  const { userDocument: user, refetch } = useUser()

  const id = randomId()
  return useMutation(async () => {
    try {
      showNotification({
        title: t('In progress'),
        message: t('Processing'),
        loading: true,
        autoClose: false,
        id,
      })
      const res = await fetchUtil({
        reqData: [{ customerId: user.driverId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/resendOTP`,
        user,
      })
      updateNotification({
        title: t('OTP was resent'),
        message: t('check your messages'),
        autoClose: true,
        id,
        color: 'green',
      })
      refetch()
      return res
    } catch (error) {
      updateNotification({
        message: t('An Error occurred'),
        id,
        color: 'red',
        loading: false,
        autoClose: true,
      })
      console.error(error)
    }
  })
}
