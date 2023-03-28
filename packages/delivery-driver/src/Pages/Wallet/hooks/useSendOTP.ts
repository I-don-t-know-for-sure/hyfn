import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useSendOTP = () => {
  const { userDocument: user, refetch } = useUser()

  const id = randomId()
  return useMutation(
    async (paymentInfo: {
      amountToBeAdded: number
      customerPhone: string
      birthYear: string
      OTPSent: Dispatch<SetStateAction<boolean>>
    }) => {
      console.log(JSON.stringify([{ customerId: user.driverId, ...paymentInfo }]))
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        })
        const res = await fetchUtil({
          reqData: [{ customerId: user.driverId, ...paymentInfo }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/sendOTP`,
        })
        updateNotification({
          title: t('OTP sent'),
          message: t('check your messages'),
          color: 'green',
          autoClose: true,
          id,
        })
        paymentInfo.OTPSent(true)
        refetch()
        return res
      } catch (error) {
        console.error(error)
        updateNotification({
          message: t('An Error occurred'),
          id,
          color: 'red',
          loading: false,
          autoClose: true,
        })
      }
    },
  )
}
