import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useAddToTopUp = () => {
  const { userDocument: user, refetch } = useUser()

  const id = randomId()
  return useMutation(async ({ amountToBeAdded, OTP }: { OTP: string; amountToBeAdded: number }) => {
    try {
      console.log(JSON.stringify([{ customerId: user.id, OTP }]))

      showNotification({
        title: t('In progress'),
        message: t('Processing'),
        loading: true,
        autoClose: false,
        id,
      })
      const res = await fetchUtil({
        reqData: [{ customerId: user.driverId, OTP, amountToBeAdded }],
        url: import.meta.env.VITE_APP_ADD_TO_TOP_UP,
        user,
      })
      updateNotification({
        message: t('Success'),
        id,
        color: 'green',
        loading: false,
        autoClose: true,
      })
      refetch()
      return res
    } catch (e) {
      updateNotification({
        message: t('An Error occurred'),
        id,
        color: 'red',
        loading: false,
        autoClose: true,
      })
      console.error(e)
    }
  })
}
