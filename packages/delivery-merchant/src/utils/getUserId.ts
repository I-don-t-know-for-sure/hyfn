import { Auth } from 'aws-amplify'

export const getUserId = async () => {
  const user = await Auth.currentAuthenticatedUser()
  return user.username
}
