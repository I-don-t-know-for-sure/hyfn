import { useUser } from 'contexts/userContext/User'
import { useMutation } from 'react-query'
import fetchUtil from 'utils/fetch'

export const useSetDriverAsNotVerified = () => {
  const { userDocument } = useUser()
  return useMutation(async ({ orderId, storeId }: { orderId: string; storeId: string }) => {
    try {
      const country = userDocument?.storeDoc.country
      const result = await fetchUtil({
        reqData: [{ orderId, storeId, country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/setDriverAsNotVerified`,
      })
    } catch (error) {
      console.log('🚀 ~ file: useSetDriverAsNotVerified.ts:8 ~ returnuseMutation ~ error', error)
    }
  })
}
