import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { useMutation } from 'react-query'

import fetchUtil from 'utils/fetch'

const useUpdateProductState = () => {
  const { userId, userDocument } = useUser()

  const id = randomId()
  return useMutation(async (productId: string) => {
    try {
      showNotification({
        title: t('Updating product'),
        message: t('Updating product'),
        loading: true,
        id,
      })
      const res = fetchUtil({
        reqData: [{ isActive: false }, userDocument?.storeDoc, productId],
        url: `${import.meta.env.VITE_APP_BASE_URL}/updateProductState`,
      })
      updateNotification({
        title: t('Done'),
        message: t('Successful'),
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
    }
  })
}

export default useUpdateProductState
