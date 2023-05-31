import { Cognito, StackContext, StaticSite, use } from "sst/constructs";
import { getStage } from "../../stacks";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnOutput, Fn } from "aws-cdk-lib";
import { frConfig } from "../../frEnvVaraibles";

const localhost = "http://localhost:";

export function adminApp({ stack }: StackContext) {
  const stage = getStage(stack.stage);

  const s3BucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const paymentAppUrl = Fn.importValue(`paymentAppUrl-${stack.stage}`);

  const authBucketName = Fn.importValue(`authBucketName-${stack.stage}`);
  // const url = Fn.importValue(`adminApiUrl-${stack.stage}`);
  const site = new StaticSite(stack, "admin-app", {
    path: "./",
    buildOutput: "dist",
    buildCommand: "yarn build",

    environment: {
      GENERATE_SOURCEMAP: "false",
      VITE_APP_BUCKET_URL: `https://${s3BucketName}.s3.${stack.region}.amazonaws.com`,
      VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL:
        frConfig[stage].MOAMALAT_PAYMEN_GATEWAY_URL,

      VITE_APP_PAYMENT_APP_URL: paymentAppUrl,
      VITE_APP_COGNITO_IDENTITY_POOL_ID: Fn.importValue(
        `adminCognitoIdentityPoolId-${stack.stage}`
      ),
      VITE_APP_COGNITO_REGION: stack.region,
      VITE_APP_USER_POOL_ID: Fn.importValue(`adminUserPoolId-${stack.stage}`),
      VITE_APP_USER_POOL_CLIENT_ID: Fn.importValue(
        `adminUserPoolClientId-${stack.stage}`
      ),
      VITE_APP_BUCKET: authBucketName,

      VITE_APP_BASE_URL: Fn.importValue(`adminApiUrl-${stack.stage}`),
    },
  });

  new CfnOutput(stack, "adminSiteUrl-" + stack.stage, {
    value: site.url || localhost + 3006,
    exportName: "adminSiteUrl-" + stack.stage, // export name
  });
  stack.addOutputs({});
}
