import { useMutation } from 'react-query'

import { useLocation } from '../../../contexts/locationContext/LocationContext'
import fetchUtil from '../../../utils/fetch'

export const useValidateStoreLocalCardTransaction = () => {
  const [{ country }] = useLocation()
  return useMutation(async ({ transactionId }: { transactionId: string }) => {
    return await fetchUtil({
      reqData: [{ transactionId, country }],
      url: `${import.meta.env.VITE_APP_BASE_URL}/validateStoreLocalCardTransaction`,
    })
  })
}
