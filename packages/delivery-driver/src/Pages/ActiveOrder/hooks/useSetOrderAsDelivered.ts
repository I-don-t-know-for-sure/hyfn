import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useLocation } from 'contexts/locationContext/LocationContext'
import { useUser } from 'contexts/userContext/User'

import { t } from 'utils/i18nextFix'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useSetOrderAsDelivered = () => {
  const { userDocument: user } = useUser()
  const [{ country }] = useLocation()
  const queryClient = useQueryClient()
  const id = randomId()
  return useMutation(
    ['setOrderAsDelievered'],
    async ({ confirmationCode }: { confirmationCode: string }) => {
      try {
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        })
        const result = await fetchUtil({
          reqData: [{ country, id: user?._id, confirmationCode }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/setOrderAsDelivered`,
        })
        updateNotification({
          message: t('Success'),
          id,
          color: 'green',
          loading: false,
          autoClose: true,
        })
        return result
      } catch (error) {
        updateNotification({
          message: t('An Error occurred'),
          id,
          color: 'red',
          loading: false,
          autoClose: true,
        })
      }
    },
    {
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(['activeOrder', user.orderId])
      },
    },
  )
}
