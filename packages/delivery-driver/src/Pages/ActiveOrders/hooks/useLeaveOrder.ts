import { useLocation } from 'contexts/locationContext/LocationContext'
import { useMutation } from 'react-query'
import fetchUtil from 'utils/fetch'

export const useLeaveOrder = () => {
  const [{ country }] = useLocation()
  return useMutation(async ({ orderId }: { orderId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ orderId, country }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/leaveOrder`,
      })
      return result
    } catch (error) {
      console.log('🚀 ~ file: useLeaveOrder.ts:8 ~ returnuseMutation ~ error', error)
    }
  })
}
