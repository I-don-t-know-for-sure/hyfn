import { useUser } from 'contexts/userContext/User'
import { useMutation } from 'react-query'
import fetchUtil from 'utils/fetch'

export const useSetOrderAsAccepted = () => {
  const { userDocument } = useUser()
  const country = userDocument?.storeDoc?.country
  return useMutation(async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
    try {
      const result = fetchUtil({
        reqData: [{ orderId, storeId, country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/setOrderAsAccepted`,
      })
      return result
    } catch (error) {
      console.log('🚀 ~ file: useSetOrderAsAccepted.ts:8 ~ returnuseMutation ~ error', error)
      throw new Error('error')
    }
  })
}
