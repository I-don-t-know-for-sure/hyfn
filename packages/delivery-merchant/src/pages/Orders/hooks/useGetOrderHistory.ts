import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { orderHistory } from 'config/constants'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { useInfiniteQuery, useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router'

import fetchUtil from 'utils/fetch'

export const useGetOrderHistory = () => {
  const { userId, userDocument } = useUser()

  return useInfiniteQuery([orderHistory], async () => {
    return await fetchUtil({
      reqData: [{ ...(userDocument?.storeDoc as any), status: 'confirmed' }],
      url: `${import.meta.env.VITE_APP_BASE_URL}/getOrderHistory`,
    })
  })
}
