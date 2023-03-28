import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useLocation } from 'contexts/locationContext/LocationContext'
import { useUser } from 'contexts/userContext/User'

import { t } from 'utils/i18nextFix'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useSetProductAsPickedUp = () => {
  const { userDocument: user } = useUser()

  const [{ country }] = useLocation()
  const queryClient = useQueryClient()
  const id = randomId()
  return useMutation(
    async ({
      storeId,
      productKey,

      QTYFound,
    }: {
      storeId: string
      productKey: string
      QTYFound: number
    }) => {
      try {
        console.log(
          JSON.stringify([
            {
              country,
              storeId,
              productKey,
              QTYFound,
              driver: user?._id,
            },
          ]),
        )
        console.log({
          country,
          storeId,
          productKey,
          QTYFound,

          driverId: user?._id,
        })
        showNotification({
          title: t('In progress'),
          message: t('Processing'),
          loading: true,
          autoClose: false,
          id,
        })
        const result = await fetchUtil({
          reqData: [
            {
              country,
              storeId,
              productKey,
              QTYFound,

              driverId: user?._id,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/setProductAsPickedUp`,
        })
        updateNotification({
          message: t('Success'),
          id,
          color: 'green',
          loading: false,
          autoClose: true,
        })
        return result
      } catch (error) {
        updateNotification({
          message: t('An Error occurred'),
          id,
          color: 'red',
          loading: false,
          autoClose: true,
        })
      }
    },
    {
      onSettled(data, error, variables, context) {
        queryClient.invalidateQueries(['activeOrder', user.orderId])
      },
    },
  )
}
