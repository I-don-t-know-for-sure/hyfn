// import { useLocation } from 'contexts/locationContext/LocationContext';
import { useUser } from 'contexts/userContext/User'
import { useMutation } from 'react-query'

import fetchUtil from '../../../utils/fetch'

export const useValidateStoreLocalCardTransaction = () => {
  const { userId, userDocument } = useUser()

  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    try {
      const { country } = userDocument?.storeDoc as { country: string }

      return await fetchUtil({
        reqData: [{ transactionId, country }],
        url: `${import.meta.env.VITE_APP_CUSTOMER_BASE_URL}/validateStoreLocalCardTransaction`,
      })
    } catch (error) {
      console.log('🚀 ~ file: useValidateStoreLocalCardTransaction.ts:19 ~ returnuseMutation ~ error', error)
    }
  })
}
