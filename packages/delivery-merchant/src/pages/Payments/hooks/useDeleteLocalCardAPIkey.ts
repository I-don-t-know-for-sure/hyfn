import { useMutation } from 'react-query'

import fetchUtil from 'utils/fetch'

export const useDeleteLocalCardAPIKey = () => {
  return useMutation(async () => {
    return await fetchUtil({ reqData: [], url: `${import.meta.env.VITE_APP_BASE_URL}/deleteLocalCardAPIKey` })
  })
}
