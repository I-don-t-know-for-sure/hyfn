import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { log } from 'console'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router'

import fetchUtil from 'utils/fetch'
import { CollectionInfo } from '../types'

export const useDeleteCollection = () => {
  const { userId, userDocument } = useUser()

  const navigate = useNavigate()
  const id = randomId()
  return useMutation('collections', async (collectionId: string) => {
    try {
      showNotification({
        title: t('In Progress'),
        message: `${t('Deleting Collection')} `,
        loading: true,
        autoClose: true,
        id,
      })
      const data = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/deleteCollection`,
        reqData: [userDocument?.storeDoc, collectionId],
      })
      updateNotification({
        title: t('Successful'),
        message: ` Collection ${t('was Deleted successfully')}`,
        color: 'green',
        autoClose: true,
        id,
      })
      navigate('/collections', { replace: true })
      return data
    } catch (e) {
      console.error(e)
      updateNotification({
        title: t('Error'),
        message: t('An Error occurred'),
        color: 'red',
        autoClose: true,
        id,
      })
    }
  })
}
