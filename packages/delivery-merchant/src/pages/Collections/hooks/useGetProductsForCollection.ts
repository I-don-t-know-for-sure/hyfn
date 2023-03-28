import { showNotification } from '@mantine/notifications'
import { allProductsForCollection } from 'config/constants'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { useInfiniteQuery, useQuery } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useGetProductsForCollection = ({ collectionId, checked }: { collectionId: string; checked: boolean }) => {
  const { userId, userDocument } = useUser()

  return useInfiniteQuery(
    [allProductsForCollection, collectionId],
    async ({ pageParam }) => {
      try {
        const { country } = userDocument.storeDoc as { country: string }

        const result = await fetchUtil({
          reqData: [
            {
              country,
              storeId: userDocument._id,
              lastDoc: pageParam,
              collectionId,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getProductsForCollection`,
        })
        return result
      } catch (error) {
        showNotification({
          title: t('Error'),
          message: t('An Error occurred'),
          color: 'red',
          autoClose: true,
        })
      }
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      enabled: !!checked,
    },
  )
}
