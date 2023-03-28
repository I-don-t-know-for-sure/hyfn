import { Auth } from 'aws-amplify'
import { useQuery } from 'react-query'

export const useGetUserInfo = () => {
  return useQuery([], async () => {
    try {
      const userInfo = await Auth.currentUserInfo()
      return userInfo
    } catch (error) {
      return new Error(error as string)
    }
  })
}
