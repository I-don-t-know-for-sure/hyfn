import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { Store } from 'config/types'
import { useUser } from 'contexts/userContext/User'
import useUploadImage from 'hooks/useUploadImage'
import { t } from 'utils/i18nextFix'
import { useMutation, useQuery } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useUpdateStoreInfo = () => {
  const { userId, userDocument } = useUser()
  const uploadStoreImage = useUploadImage()

  const id = userId
  const notificationId = randomId()
  return useMutation(['storeInfo', id], async (storeInfo: any) => {
    try {
      const { imageObj, ...store } = storeInfo

      showNotification({
        message: t('Updating Store Info'),
        title: t('In Progress'),
        loading: true,
        autoClose: false,
        id: notificationId,
      })

      if (imageObj) {
        const storeFrontImage = storeInfo.imageObj ? await uploadStoreImage(storeInfo.imageObj) : storeInfo.image

        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateStoreInfo`,

          reqData: [userDocument.storeDoc, { ...store, image: storeFrontImage }],
        })
        updateNotification({
          message: t('Store Info was successfully updated'),
          title: t('Successful'),
          loading: false,
          autoClose: true,
          id: notificationId,
        })
        return result
      }
      console.log(`${import.meta.env.VITE_APP_BASE_URL}/updateStoreInfo`)

      const result = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/updateStoreInfo`,

        reqData: [userDocument.storeDoc, { ...store }],
      })

      updateNotification({
        message: t('Store Info was successfully updated'),
        title: t('Successful'),
        loading: false,
        autoClose: true,
        id: notificationId,
      })

      return result
    } catch (e) {
      updateNotification({
        title: t('Error'),
        message: t('An Error occurred'),
        color: 'red',
        autoClose: true,
        id: notificationId,
      })
      console.error(e)
    }
  })
}
