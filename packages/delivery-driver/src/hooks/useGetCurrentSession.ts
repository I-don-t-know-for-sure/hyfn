import { Auth } from 'aws-amplify'
import { GETCURRENTUSERINFO } from 'config/constants'
import { useQuery } from 'react-query'

export const useGetCurrentSession = () => {
  return useQuery([GETCURRENTUSERINFO], async () => {
    try {
      const session = await Auth.currentSession()
      return session
    } catch (error) {
      console.log(error)
    }
  })
}
