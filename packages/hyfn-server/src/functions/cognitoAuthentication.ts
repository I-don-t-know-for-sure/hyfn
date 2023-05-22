import { CognitoJwtVerifier } from "aws-jwt-verify";
const COGNITO_URL = `https://cognito-idp.${"eu-south-1"}.amazonaws.com/`;
export const cognitoAuthentication = async ({
  accessToken,
  userId,
}: {
  accessToken: string;
  userId: string;
}) => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.userPoolId || "",
    tokenUse: "access",
    clientId: process.env.userPoolClientId || "",
  });

  try {
    await verifier.verify(
      accessToken // the JWT as string
    );
  } catch {
    throw new Error("token not verified");
  }
};
