import { Auth } from "aws-amplify";

export const getAccessToken = async () => {
  const result = await Auth.currentAuthenticatedUser();

  const {
    signInUserSession: {
      accessToken: { jwtToken },
    },
    username,
  } = result;
  return {
    accessToken: jwtToken,
    userId: username,
  };
};
