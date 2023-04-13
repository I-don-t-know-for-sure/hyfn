import { CognitoJwtVerifier } from "aws-jwt-verify";
const COGNITO_URL = `https://cognito-idp.${"eu-south-1"}.amazonaws.com/`;
export const cognitoAuthentication = async ({
  accessToken,
  userId,
}: {
  accessToken: string;
  userId: string;
}) => {
  console.log("🚀 ~ file: cognitoAuthentication.ts:13 ~ userId:", userId);
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.userPoolId || "",
    tokenUse: "access",
    clientId: process.env.userPoolClientId || "",
  });

  try {
    const payload = await verifier.verify(
      accessToken // the JWT as string
    );
    console.log("Token is valid. Payload:", payload);
  } catch {
    console.log("Token not valid!dchbchfbhbfhbhbdchbdhbchdb");
    throw new Error("token not verified");
  }
};
