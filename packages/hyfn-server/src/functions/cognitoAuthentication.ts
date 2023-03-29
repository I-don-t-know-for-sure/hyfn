import axios from "axios";

import AmazonCognitoIdentity from "amazon-cognito-identity-js";
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
  }
};

// const COGNITO_URL = `https://cognito-idp.${"eu-south-1"}.amazonaws.com/`;
// export const cognitoAuthentication = async ({
//   accessToken,
//   userId,
// }: {
//   accessToken: string;
//   userId: string;
// }) => {
//   try {
//     const token = accessToken;

//     const { data } = await axios.post(
//       COGNITO_URL,
//       {
//         AccessToken: token,
//       },
//       {
//         headers: {
//           "Content-Type": "application/x-amz-json-1.1",
//           "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser",
//         },
//       }
//     );
//     // console.log("🚀 ~ file: cognitoAuthentication.ts:26 ~ data:", data);
//     const authenticatedUserId = data.Username;
//     console.log(
//       "🚀 ~ file: cognitoAuthentication.ts:28 ~ authenticatedUserId:",
//       authenticatedUserId
//     );
//     if (authenticatedUserId !== userId) {
//       throw new Error("unauthorized");
//     }

//     // function isJSON(str: string) {
//     //   try {
//     //     JSON.parse(str);
//     //   } catch (e) {
//     //     return false;
//     //   }
//     //   return true;
//     // }
//     // console.log(
//     //   "🚀 ~ file: cognitoAuthentication.js:19 ~ cognitoAuthentication ~ data",
//     //   data
//     // );
//     // var parsedAttributes = {};
//     // data.UserAttributes.map((attribute: any) => {
//     //   console.log(
//     //     "🚀 ~ file: cognitoAuthentication.ts:45 ~ data.UserAttributes.map ~ attribute:",
//     //     attribute
//     //   );
//     //   parsedAttributes = {
//     //     ...parsedAttributes,

//     //     [attribute.Name]: isJSON(attribute.Value)
//     //       ? JSON.parse(attribute.Value)
//     //       : attribute.Value,
//     //   };
//     // });
//     // console.log(
//     //   "🚀 ~ file: cognitoAuthentication.ts:57 ~ parsedAttributes:",
//     //   parsedAttributes
//     // );
//     return { customerId: userId };
//   } catch (error) {
//     console.log(
//       "🚀 ~ file: cognitoAuthentication.js:22 ~ cognitoAuthentication ~ error",
//       error
//     );
//     // throw new Error(error as any);
//   }
// };
