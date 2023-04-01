import { Cognito, StackContext, StaticSite, use } from "sst/constructs";
import { getStage } from "../../stacks/getStage";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnOutput, Fn } from "aws-cdk-lib";
import { frConfig } from "../../frEnvVaraibles";

import {
  customerApiStack,
  customerCognitoStack,
} from "../customer-backend/customerStack";
const localhost = "http://localhost:";

export function customerApp({ stack }: StackContext) {
  const stage = getStage(stack.stage);
  // const { s3Bucket } = use(imagesBucketStack);
  // const { site: paymentSite } = use(paymentApp);
  // const { auth } = use(customerCognitoStack);
  // const { api } = use(customerApiStack);
  // const { authBucket } = use(authBucketStack);
  const s3BucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const paymentAppUrl = Fn.importValue(`paymentAppUrl-${stack.stage}`);
  const cognitoIdentityPoolId = Fn.importValue(
    `customerCognitoIdentityPoolId-${stack.stage}`
  );

  const cognitoUserPoolId = Fn.importValue(`customerUserPoolId-${stack.stage}`);

  const cognitoUserPoolClientId = Fn.importValue(
    `customerUserPoolClientId-${stack.stage}`
  );
  const authBucketName = Fn.importValue(`authBucketName-${stack.stage}`);
  const url = Fn.importValue(`customerApiUrl-${stack.stage}`);

  const site = new StaticSite(stack, "customer-app", {
    path: "./",
    buildOutput: "dist",
    buildCommand: "yarn build",

    ...(stack.stage === "production"
      ? {
          customDomain: {
            domainName: "hyfn.xyz",
            domainAlias: "www.hyfn.xyz",
            hostedZone: "hyfn.xyz",
            // isExternalDomain: true,
          },
        }
      : {}),

    environment: {
      GENERATE_SOURCEMAP: "false",
      VITE_APP_BUCKET_URL: `https://${s3BucketName}.s3.${stack.region}.amazonaws.com`,
      VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL:
        frConfig[stage].MOAMALAT_PAYMEN_GATEWAY_URL,
      // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=
      VITE_APP_PAYMENT_APP_URL: paymentAppUrl || localhost + "3002",
      VITE_APP_COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId || "",
      VITE_APP_COGNITO_REGION: stack.region,
      VITE_APP_USER_POOL_ID: cognitoUserPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: cognitoUserPoolClientId,
      VITE_APP_BUCKET: authBucketName,

      // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=

      VITE_APP_BASE_URL: url,
    },
  });

  new CfnOutput(stack, "customerSiteUrl-" + stack.stage, {
    value: site.url || localhost + "3003",
    exportName: "customerSiteUrl-" + stack.stage, // export name
  });
  stack.addOutputs({
    GENERATE_SOURCEMAP: "false",
    VITE_APP_BUCKET_URL: `https://${s3BucketName}.s3.${stack.region}.amazonaws.com`,
    VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL:
      frConfig[stage].MOAMALAT_PAYMEN_GATEWAY_URL,
    // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=
    VITE_APP_PAYMENT_APP_URL: paymentAppUrl || localhost + "3002",
    VITE_APP_COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId || "",
    VITE_APP_COGNITO_REGION: stack.region,
    VITE_APP_USER_POOL_ID: cognitoUserPoolId,
    VITE_APP_USER_POOL_CLIENT_ID: cognitoUserPoolClientId,
    VITE_APP_BUCKET: authBucketName,

    // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=

    VITE_APP_BASE_URL: url,
  });
}
