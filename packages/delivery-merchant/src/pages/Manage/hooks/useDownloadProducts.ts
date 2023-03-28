import useUploadImage from 'hooks/useUploadImage'

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'
import { showNotification, updateNotification } from '@mantine/notifications'

import { ProductInfo } from '../types'
import { randomId } from '@mantine/hooks'
import fetchUtil from 'utils/fetch'
import { t } from 'utils/i18nextFix'
import { useUser } from 'contexts/userContext/User'

export const useDownlaodProducts = () => {
  const id = randomId()
  const { userId, userDocument } = useUser()

  return useMutation(async () => {
    try {
      showNotification({
        title: t('inserting new products'),
        message: t('In progress'),
        id,
        loading: true,
        autoClose: false,
      })
      const { country } = userDocument.storeDoc as { country: string }

      fetch(`${import.meta.env.VITE_APP_DOWNLOAD_ALL_PRODUCTS}`, {
        method: 'POST',
        body: JSON.stringify([{ storeId: userDocument._id, country }]),
      }).then(async (response) => {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', userDocument._id as string)
        document.body.appendChild(link)
        link.click()
      })
      // const result = await fetchUtil({
      //   reqData: [{ storeId: user.customData._id, country }],
      //   url: import.meta.env.VITE_APP_DOWNLOAD_ALL_PRODUCTS,
      //   user,
      // });

      updateNotification({
        title: t('Products were added successfully'),
        message: t('Successful'),
        id,
        loading: false,
        autoClose: true,
      })
      return 'seccess'
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
