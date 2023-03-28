import { Auth } from 'aws-amplify'
import { useQuery } from 'react-query'

export const useGetUserId = ({ loggedIn, setUserId }: { loggedIn: boolean; setUserId: any }) => {
  return useQuery(
    [loggedIn],
    async () => {
      const user = await Auth.currentAuthenticatedUser()
      setUserId(user.username)
    },
    {
      enabled: loggedIn,
    },
  )
}
