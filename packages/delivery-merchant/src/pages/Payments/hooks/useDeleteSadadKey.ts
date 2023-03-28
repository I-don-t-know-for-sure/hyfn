import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'

import { useMutation, useQueryClient } from 'react-query'

import fetchUtil from 'utils/fetch'
export const useDeleteSadadAPIKey = () => {
  const { userId, userDocument } = useUser()

  const queryClient = useQueryClient()
  const storeDoc = userDocument?.storeDoc as { id: string }
  return useMutation(
    async () => {
      const random = randomId()
      try {
        showNotification({
          title: 'updating',
          message: 'updating',
          loading: true,
          autoClose: false,
          id: random,
        })

        const result = await fetchUtil({
          reqData: [storeDoc],
          url: `${import.meta.env.VITE_APP_BASE_URL}/deleteSadadKey`,
        })
        updateNotification({
          title: 'updated',
          message: 'updated',
          color: 'green',
          autoClose: true,
          id: random,
        })
        return result
      } catch (error) {
        updateNotification({
          message: 'An Error occurred',
          title: 'Error',
          autoClose: true,
          color: 'red',
          id: random,
        })
      }
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['storeInfo', storeDoc.id])
      },
    },
  )
}
