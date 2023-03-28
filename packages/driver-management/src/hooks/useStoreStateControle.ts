import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { useMutation } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useStoreStateControl = () => {
  const { userId, userDocument, refetch } = useUser()

  const id = randomId()
  return useMutation(['storeState', userDocument?.opened], async () => {
    try {
      showNotification({
        message: userDocument?.opened
          ? `${t('Closing')} ${userDocument?.storeName}`
          : `${t('Opening')} ${userDocument?.storeName}`,
        loading: true,
        autoClose: false,
        id,
      })
      const { country } = userDocument?.storeDoc as { country: string }

      const result = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/openAndCloseStore`,
        reqData: [userDocument?._id, country],
      })

      updateNotification({
        message: t('Done'),

        autoClose: true,
        id,
      })
      refetch()
      return result
    } catch (error) {
      updateNotification({
        title: t('Error'),
        message: t('An Error occurred'),

        autoClose: true,
        id,
      })
    }
  })
}
