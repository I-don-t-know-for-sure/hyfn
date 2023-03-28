import useUploadImage from 'hooks/useUploadImage'

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'
import { showNotification, updateNotification } from '@mantine/notifications'

import { ProductInfo } from '../types'
import { randomId } from '@mantine/hooks'
import fetchUtil from 'utils/fetch'
import { t } from 'utils/i18nextFix'
import { productsSearch } from 'config/constants'
import { useUser } from 'contexts/userContext/User'

export const useSearchProducts = (value: string) => {
  const { userId, userDocument } = useUser()

  return useQuery(
    [productsSearch, value],
    async () => {
      try {
        const { country, storeFrontId: storeId } = userDocument.storeDoc as {
          country: string
          storeFrontId: string
        }

        const result = await fetchUtil({
          reqData: [{ value, country, storeId }],
          url: import.meta.env.VITE_APP_SEARCH_PRODUCTS,
        })
        return result
      } catch (error) {
        showNotification({
          title: t('Error'),
          message: t('An Error occurred'),
          autoClose: true,
        })
      }
    },
    {
      keepPreviousData: true,

      enabled: !!value,
    },
  )
}
