import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'

import { useMutation, useQueryClient } from 'react-query'

import fetchUtil from 'utils/fetch'

const useUpdateStoreOwnerInfo = () => {
  const { userDocument } = useUser()
  const notificationId = randomId()

  return useMutation([], async (storeInfo: any) => {
    try {
      const storeDoc = userDocument?.storeDoc as { id: string }
      if (storeDoc) {
        showNotification({
          title: t('In Progress'),
          message: `${t('Updating Store Info')}`,
          loading: true,
          autoClose: true,
          id: notificationId,
        })
        const result = await fetchUtil({
          reqData: [userDocument.storeDoc, { ...storeInfo }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateStoreOwnerInfo`,
        })
        // await user?.functions.updateStoreOwnerInfo([
        //   user?.customData.storeDoc,
        //   { ...storeInfo },
        // ]);
        updateNotification({
          title: t('Successful'),
          message: ` "${t('Store info was updated successfully')}`,
          color: 'green',
          autoClose: true,
          id: notificationId,
        })
      }
    } catch (e) {
      console.error(e)
      updateNotification({
        title: t('Error'),
        message: t('An Error occurred'),
        color: 'red',
        autoClose: true,
        id: notificationId,
      })
    }
  })
}

export default useUpdateStoreOwnerInfo
