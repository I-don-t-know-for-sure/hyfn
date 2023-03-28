import useUploadImage from 'hooks/useUploadImage'

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'
import { showNotification, updateNotification } from '@mantine/notifications'

import { ProductInfo } from '../types'
import { randomId } from '@mantine/hooks'
import fetchUtil from 'utils/fetch'
import { t } from 'utils/i18nextFix'
import { useUser } from 'contexts/userContext/User'
export const useBulkWrite = () => {
  const { userId, userDocument } = useUser()

  const id = randomId()
  return useMutation(async (productsArray: any) => {
    try {
      showNotification({
        title: t('inserting new products'),
        message: t('In progress'),
        id,
        loading: true,
        autoClose: false,
      })

      const result = await fetchUtil({
        reqData: [{ productsArray, storeId: userDocument._id }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/bulkWrite`,
      })
      updateNotification({
        title: t('Products were added successfully'),
        message: t('Successful'),
        id,
        loading: false,
        autoClose: true,
      })
      return result
    } catch (error) {
      updateNotification({
        title: t('Error'),
        message: t('An Error occurred'),
        id,
        autoClose: true,
        color: 'red',
      })
    }
  })
}
