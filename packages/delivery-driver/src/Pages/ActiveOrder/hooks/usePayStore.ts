import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useLocation } from 'contexts/locationContext/LocationContext'
import { useUser } from 'contexts/userContext/User'

import { t } from 'utils/i18nextFix'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import fetchUtil from 'utils/fetch'

export const usePayStore = () => {
  const { userDocument: user } = useUser()
  const [{ country }] = useLocation()
  const id = randomId()
  return useMutation(async (storeId: string) => {
    try {
      showNotification({
        title: t('In progress'),
        message: t('Processing'),
        loading: true,
        autoClose: false,
        id,
      })
      const result = await fetchUtil({
        reqData: [
          {
            driverId: user?._id,
            storeId,
            country,
          },
        ],
        url: `${import.meta.env.VITE_APP_BASE_URL}/payStore`,
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
  })
}
