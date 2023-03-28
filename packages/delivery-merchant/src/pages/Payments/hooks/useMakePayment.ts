import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useMakePayment = () => {
  const { userDocument } = useUser()
  const id = randomId()
  return useMutation(async ({ numberOfMonths, OTP }: { OTP: string; numberOfMonths: number }) => {
    try {
      showNotification({
        title: t('In Progress'),
        message: t('Making Payment'),
        autoClose: false,
        loading: true,
        id,
      })

      const res = await fetchUtil({
        reqData: [{ storeId: userDocument._id, OTP, numberOfMonths }],
        url: import.meta.env.VITE_APP_MAKEPAYMENT,
      })
      updateNotification({
        title: t('Successful'),
        message: `${t('Payment completed successfully')}`,
        color: 'green',
        autoClose: true,
        id,
      })
      return res
    } catch (e) {
      updateNotification({
        title: t('Error'),
        message: t('An Error occurred'),
        color: 'red',
        autoClose: true,
        id,
      })
      console.error(e)
    }
  })
}

export const useSendOTP = () => {
  const { userId } = useUser()
  const id = randomId()
  return useMutation(
    async (paymentInfo: {
      numberOfMonths: number
      customerPhone: string
      birthYear: string
      OTPSent: Dispatch<SetStateAction<boolean>>
    }) => {
      try {
        showNotification({
          title: t('In Progress'),
          message: t('Sending OTP'),
          autoClose: false,
          loading: true,
          id,
        })
        const res = await fetchUtil({
          reqData: [{ customerId: userId, ...paymentInfo }],
          url: import.meta.env.VITE_APP_SENDOTP,
        })
        paymentInfo.OTPSent(true)
        updateNotification({
          title: t('OTP was sent successfully'),
          message: `${t('Check your messages')}`,
          color: 'green',
          autoClose: true,
          id,
        })
        return res
      } catch (error) {
        console.error(error)
        updateNotification({
          title: t('Error'),
          message: t('An Error occurred'),
          color: 'red',
          autoClose: true,
          id,
        })
      }
    },
  )
}

export const useResendOTP = () => {
  const { userId } = useUser()

  const id = randomId()
  return useMutation(async () => {
    try {
      showNotification({
        title: t('In Progress'),
        message: t('resending OTP'),
        autoClose: false,
        loading: true,
        id,
      })
      const res = await fetchUtil({
        reqData: [{ customerId: userId }],
        url: import.meta.env.VITE_APP_RESENDOTP,
      })
      updateNotification({
        title: t('OTP was resent successfully'),
        message: `${t('Check your messages')}`,
        color: 'green',
        autoClose: true,
        id,
      })
      return res
    } catch (error) {
      updateNotification({
        title: t('Error'),
        message: t('An Error occurred'),
        color: 'red',
        autoClose: true,
        id,
      })
      console.error(error)
    }
  })
}
