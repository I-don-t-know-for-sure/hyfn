import { Cognito, StackContext, StaticSite, use } from "sst/constructs";
import { getStage } from "../../stacks";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnOutput, Fn } from "aws-cdk-lib";
import { frConfig } from "../../frEnvVaraibles";
import { storeApiStack, storeCognitoStack } from "../../stacks/storeBackend";
import { config } from "../../envVaraibles";
const localhost = "http://localhost:";

export function storeApp({ stack }: StackContext) {
  const stage = getStage(stack.stage);

  const s3BucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const paymentAppUrl = Fn.importValue(`paymentAppUrl-${stack.stage}`);

  const authBucketName = Fn.importValue(`authBucketName-${stack.stage}`);

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
      VITE_APP_FIREBASE_API_KEY: config[""]["firebaseApiKey"],
      VITE_APP_FIREBASE_AUTH_DOMAIN: config[""]["firebaseAuthDomain"],
      VITE_APP_FIREBASE_MESSAGING_SENDER_ID:
        config[""]["firebaseMessagingSenderId"],
      VITE_APP_FIREBASE_PROJECT_ID: config[""]["firebaseProjectId"],
      VITE_APP_FIREBASE_APP_ID: config[""]["firebaseAppId"],
      VITE_APP_FIREBASE_STORAGE_BUCKET: config[""]["firebaseStorageBucket"],
      VITE_APP_VAPID_KEY: config[""]["vapidKey"],
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

      VITE_APP_BASE_URL: Fn.importValue(`storeApiUrl-${stack.stage}`),
    },
  });

  new CfnOutput(stack as any, "storeSiteUrl-" + stack.stage, {
    value: site.url || localhost + "4001",
    exportName: "storeSiteUrl-" + stack.stage, // export name
  });
  stack.addOutputs({});
}
