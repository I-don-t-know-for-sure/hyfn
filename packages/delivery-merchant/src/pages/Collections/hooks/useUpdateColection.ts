import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { log } from 'console'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router'

import fetchUtil from 'utils/fetch'
import { CollectionInfo } from '../types'

export const useUpdateCollection = () => {
  const { userId, userDocument } = useUser()

  const id = randomId()
  return useMutation(
    'collection',
    async ({ collection, collectionId }: { collectionId: string; collection: CollectionInfo }) => {
      try {
        showNotification({
          title: t('In Progress'),
          message: `${t('Updating')} ${collection.textInfo.title}`,
          loading: true,
          autoClose: true,
          id,
        })
        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateCollection`,
          reqData: [collection, userDocument?.storeDoc, collectionId],
        })
        updateNotification({
          title: t('Successful'),
          message: ` ${collection.textInfo.title} ${t('was updated successfully')}`,
          color: 'green',
          autoClose: true,
          id,
        })
        return result
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
    },
  )
}
