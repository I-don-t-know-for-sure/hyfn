import { USER_DOCUMENT } from 'config/constants'
import { useMutation, useQueryClient } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useAddLocalCardAPIKeys = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (localCardAPIKey: { MerchantId: string; TerminalId: string; secretKey: string }) => {
      return await fetchUtil({
        reqData: [localCardAPIKey],
        url: `${import.meta.env.VITE_APP_BASE_URL}/addLocalCardPaymentAPIKey`,
      })
    },
    {
      async onSuccess(data, variables, context) {
        await queryClient.invalidateQueries([USER_DOCUMENT])
      },
    },
  )
}
