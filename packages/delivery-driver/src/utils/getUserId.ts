import { Auth } from 'aws-amplify'

export const getUserId = async () => {
  const user = await Auth.currentUserInfo()
  if (!user) {
    return undefined
  }
  return user.attributes.sub
}
