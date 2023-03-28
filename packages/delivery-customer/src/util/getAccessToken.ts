import { Auth } from 'aws-amplify'

export const getAccessToken = async () => {
  const {
    signInUserSession: {
      accessToken: { jwtToken },
    },
    username,
  } = await Auth.currentAuthenticatedUser()
  return { accessToken: jwtToken, userId: username }
}
