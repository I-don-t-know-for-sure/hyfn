import { useMutation } from 'react-query'
import fetchUtil from 'utils/fetch'

export const useDisableLocalCardKeys = () => {
  return useMutation(async () => {
    try {
      const result = await fetchUtil({ reqData: [], url: `${import.meta.env.VITE_APP_BASE_URL}/disableLocalCardAPIKeys` })
    } catch (error) {
      console.log('🚀 ~ file: useDisableLocalCardKeys.ts:8 ~ returnuseMutation ~ error', error)
    }
  })
}
