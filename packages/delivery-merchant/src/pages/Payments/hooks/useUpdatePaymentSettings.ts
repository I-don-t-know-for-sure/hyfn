import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { Dispatch, SetStateAction } from 'react'
import { useMutation, useQueryClient } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useUpdatePaymentSettings = () => {
  const { userDocument, userId } = useUser()

  const queryClient = useQueryClient()
  return useMutation(
    async () => {
      const random = randomId()
      try {
        const storeDoc = userDocument?.storeDoc as { id: string }
        showNotification({
          title: 'updating',
          message: 'updating',
          loading: true,
          autoClose: false,
          id: random,
        })
        await fetchUtil({
          reqData: [{ storeId: userDocument._id, userId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/updatePaymentSettings`,
        })

        updateNotification({
          title: 'updated',
          message: 'updated',
          color: 'green',
          autoClose: true,
          id: random,
        })
      } catch (error) {
        const { message } = error as { message: string }
        updateNotification({
          message,
          title: 'Error',
          autoClose: true,
          color: 'red',
          id: random,
        })
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['storeInfo', userDocument?.storeDoc?.id])
      },
    },
  )
}
