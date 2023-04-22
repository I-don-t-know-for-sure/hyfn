import { Cognito, StackContext, StaticSite, use } from "sst/constructs";
import { getStage } from "../../stacks/getStage";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnOutput, Fn } from "aws-cdk-lib";
import { frConfig } from "../../frEnvVaraibles";
import { storeApiStack, storeCognitoStack } from "../../stacks/storeBackend";
const localhost = "http://localhost:";

export function storeApp({ stack }: StackContext) {
  const stage = getStage(stack.stage);

  const s3BucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const paymentAppUrl = Fn.importValue(`paymentAppUrl-${stack.stage}`);
  // const cognitoIdentityPoolId = Fn.importValue(
  //   `customerCognitoIdentityPoolId-${stack.stage}`
  // );
  // const cognitoRegion = Fn.importValue(
  //   `managemnentCognitoRegion-${stack.stage}`
  // );
  // const cognitoUserPoolId = Fn.importValue(
  //   `managemnentUserPoolId-${stack.stage}`
  // );
  // const cognitoUserPoolClientId = Fn.importValue(
  //   `managemnentUserPoolClientId-${stack.stage}`
  // );
  // const { auth } = use(storeCognitoStack);
  const authBucketName = Fn.importValue(`authBucketName-${stack.stage}`);
  // const { api } = use(storeApiStack);

  const site = new StaticSite(stack, "store-app", {
    path: "./",
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
      VITE_APP_COGNITO_IDENTITY_POOL_ID:
        Fn.importValue(`storeCognitoIdentityPoolId-${stack.stage}`) || "",
      VITE_APP_COGNITO_REGION: stack.region,
      VITE_APP_USER_POOL_ID: Fn.importValue(`storeUserPoolId-${stack.stage}`),
      VITE_APP_USER_POOL_CLIENT_ID: Fn.importValue(
        `storeUserPoolClientId-${stack.stage}`
      ),
      VITE_APP_BUCKET: authBucketName,

      // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=

      VITE_APP_BASE_URL: Fn.importValue(`storeApiUrl-${stack.stage}`),
    },
  });

  new CfnOutput(stack as any, "storeSiteUrl-" + stack.stage, {
    value: site.url || localhost + "4001",
    exportName: "storeSiteUrl-" + stack.stage, // export name
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
