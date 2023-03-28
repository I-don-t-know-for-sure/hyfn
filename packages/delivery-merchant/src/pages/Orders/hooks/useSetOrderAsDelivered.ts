import { useUser } from 'contexts/userContext/User'
import { useMutation } from 'react-query'
import fetchUtil from 'utils/fetch'

export const useSetOrderAsDelivered = () => {
  const { userDocument } = useUser()
  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const country = userDocument?.storeDoc.country
      const result = await fetchUtil({
        reqData: [{ country, orderId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/setOrderAsDelivered`,
      })
      return result
    } catch (error) {
      console.log('🚀 ~ file: useSetOrderAsDelivered.ts:10 ~ returnuseMutation ~ error', error)
    }
  })
}
