import { trustedDrivers } from 'config/constants'
import { useUser } from 'contexts/userContext/User'
import { useInfiniteQuery } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useGetStoreDrivers = () => {
  const { userId, userDocument } = useUser()
  console.log('🚀 ~ file: useGetStoreDrivers.ts:9 ~ useGetStoreDrivers ~ userDocument', userDocument)

  return useInfiniteQuery(
    [trustedDrivers],
    async ({ pageParam }) => {
      return fetchUtil({
        reqData: [{ storeId: userDocument?._id, lastDoc: pageParam }],

        url: `${import.meta.env.VITE_APP_BASE_URL}/getTrustedDrivers`,
      })
    },
    { keepPreviousData: true, getNextPageParam: (lastPage, pages) => lastPage?.nextCursor as any },
  )
}
