import { Auth } from 'aws-amplify'

export const isUserLoggedIn = () => {
  const user = Auth.currentAuthenticatedUser()
  const userLoggedIn = typeof user === 'object' ? Object.keys(user).length > 0 : false
  return userLoggedIn
}
