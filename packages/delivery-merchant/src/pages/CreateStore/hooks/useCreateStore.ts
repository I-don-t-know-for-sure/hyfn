import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { USER_DOCUMENT } from 'config/constants'
import { useUser } from 'contexts/userContext/User'
import { t } from 'utils/i18nextFix'
import { useMutation, useQueryClient } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useCreateStore = () => {
  const { userId } = useUser()
  const queryclient = useQueryClient()

  return useMutation(
    async (storeInfo: any) => {
      const id = randomId()
      try {
        showNotification({ id, message: t('Createing store'), autoClose: false, loading: true })
        const result = await fetchUtil({
          reqData: [{ ...storeInfo, userId }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/createStoreDocument`,
        })

        updateNotification({
          id,
          message: t('store created'),
          color: 'green',
          autoClose: true,
          loading: false,
        })
        return result
      } catch (e) {
        console.error(e)
        updateNotification({
          title: t('Error'),
          message: t('An Error occurred'),
          // color: 'red',
          autoClose: true,
          loading: false,
          id,
        })
      }
    },
    {
      async onSuccess(data, variables, context) {
        await queryclient.invalidateQueries([USER_DOCUMENT])
      },
    },
  )
}
