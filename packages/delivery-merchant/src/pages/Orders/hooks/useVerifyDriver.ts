import { useUser } from 'contexts/userContext/User'
import { useMutation } from 'react-query'
import fetchUtil from 'utils/fetch'

export const useVerifyDriver = () => {
  const { userDocument } = useUser()
  return useMutation(async ({ storeId, orderId }: { storeId: string; orderId: string }) => {
    try {
      const country = userDocument?.storeDoc?.country
      const result = await fetchUtil({
        reqData: [{ orderId, storeId, country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/verifyDriver`,
      })
      return result
    } catch (error) {
      console.log('🚀 ~ file: useVerifyDriver.ts:11 ~ returnuseMutation ~ error', error)
    }
  })
}
