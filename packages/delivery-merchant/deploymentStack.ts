import { Cognito, StackContext, StaticSite } from "sst/constructs";
import { getStage } from "../../stacks/getStage";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnOutput, Fn } from "aws-cdk-lib";
import { frConfig } from "../../frEnvVaraibles";

export function storeApp({ stack }: StackContext) {
  const stage = getStage(stack.stage);

  const s3BucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const paymentAppUrl = Fn.importValue(`paymentAppUrl-${stack.stage}`);
  const cognitoIdentityPoolId = Fn.importValue(
    `customerCognitoIdentityPoolId-${stack.stage}`
  );
  const cognitoRegion = Fn.importValue(
    `managemnentCognitoRegion-${stack.stage}`
  );
  const cognitoUserPoolId = Fn.importValue(
    `managemnentUserPoolId-${stack.stage}`
  );
  const cognitoUserPoolClientId = Fn.importValue(
    `managemnentUserPoolClientId-${stack.stage}`
  );
  const authBucketName = Fn.importValue(`authBucketName-${stack.stage}`);
  const url = Fn.importValue(`managemnentApiUrl-${stack.stage}`);

  const site = new StaticSite(stack, "delivery-merchant", {
    path: "../../packages/delivery-merchant",
    buildOutput: "dist",
    buildCommand: "yarn build",

    ...(stack.stage === "production"
      ? {
          customDomain: {
            domainName: "store.hyfn.xyz",
            domainAlias: "www.store.hyfn.xyz",
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
      VITE_APP_PAYMENT_APP_URL: paymentAppUrl,
      VITE_APP_COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId,
      VITE_APP_COGNITO_REGION: stack.region,
      VITE_APP_USER_POOL_ID: cognitoUserPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: cognitoUserPoolClientId,
      VITE_APP_BUCKET: authBucketName,

      // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=

      VITE_APP_BASE_URL: url,
    },
  });

  new CfnOutput(stack, "customerSiteUrl-" + stack.stage, {
    value: site.url || "",
    exportName: "customerSiteUrl-" + stack.stage, // export name
  });
  stack.addOutputs({
    //   customerSite: site.url || localhost + "3000",
    //   VITE_APP_PAYMENT_APP_URL: paymentAppSite.url || localhost + "3002",
    //   VITE_APP_COGNITO_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
    //   VITE_APP_COGNITO_REGION: stack.region,
    //   VITE_APP_USER_POOL_ID: auth.userPoolId,
    //   VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    //   VITE_APP_BUCKET: authBucket.bucketName,
  });
}
