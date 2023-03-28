import { randomId } from '@mantine/hooks'
import { showNotification, updateNotification } from '@mantine/notifications'
import { t } from 'utils/i18nextFix'
import { useMutation } from 'react-query'


import fetchUtil from 'utils/fetch'
import { useUser } from 'contexts/userContext/User'

export const useUpdateOptions = () => {
  const id = randomId()
  const { userId, userDocument } = useUser()

  return useMutation(async ({ productsArray }: { productsArray: any[] }) => {
    try {
      
      const validatedProducts =  productsArray
      showNotification({
        title: t('inserting new products'),
        message: t('In progress'),
        id,
        loading: true,
        autoClose: false,
      })
      const { country } = userDocument.storeDoc as { country: string }
      const result = await fetchUtil({
        reqData: [{ country, productsArray: validatedProducts }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/updateOptions`,
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
