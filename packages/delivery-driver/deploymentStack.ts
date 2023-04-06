import { Cognito, StackContext, StaticSite, use } from "sst/constructs";
import { getStage } from "../../stacks/getStage";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { CfnOutput, Fn } from "aws-cdk-lib";
import { frConfig } from "../../frEnvVaraibles";

const localhost = "http://localhost:";

export function driverApp({ stack }: StackContext) {
  const stage = getStage(stack.stage);
  // const { api } = use(driverApiStack);
  const s3BucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const paymentAppUrl = Fn.importValue(`paymentAppUrl-${stack.stage}`);
  // const mapName = Fn.importValue(`MapName${stack.stage}`);
  // const mapRegion = Fn.importValue(`MapRegion${stack.stage}`);
  // const mapStyle = Fn.importValue(`MapStyle${stack.stage}`);
  // const parameter = ssm.StringParameter.valueFromLookup(stack as any, 'my-parameter');

  // const cognitoIdentityPoolId = Fn.importValue(
  //   `driverCognitoIdentityPoolId-${stack.stage}`
  // );
  // const cognitoRegion = Fn.importValue(`driverCognitoRegion-${stack.stage}`);
  // const cognitoUserPoolId = Fn.importValue(`driverUserPoolId-${stack.stage}`);
  // const cognitoUserPoolClientId = Fn.importValue(
  //   `driverUserPoolClientId-${stack.stage}`
  // );

  // const { auth } = use(driverCognitoStack);
  const authBucketName = Fn.importValue(`authBucketName-${stack.stage}`);
  // const url = Fn.importValue(`driverApiUrl-${stack.stage}`);
  const site = new StaticSite(stack, "driver-app", {
    path: "./",
    buildOutput: "dist",
    buildCommand: "yarn build",

    ...(stack.stage === "production"
      ? {
          customDomain: {
            domainName: "driver.hyfn.xyz",
            domainAlias: "www.driver.hyfn.xyz",
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
        Fn.importValue(`driverCognitoIdentityPoolId-${stack.stage}`) || "",
      VITE_APP_COGNITO_REGION: stack.region,
      VITE_APP_USER_POOL_ID: Fn.importValue(`driverUserPoolId-${stack.stage}`),
      VITE_APP_USER_POOL_CLIENT_ID: Fn.importValue(
        `driverUserPoolClientId-${stack.stage}`
      ),
      VITE_APP_BUCKET: authBucketName,

      // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=

      VITE_APP_BASE_URL: Fn.importValue(`driverApiUrl-${stack.stage}`),
    },
  });

  new CfnOutput(stack as any, "driverSiteUrl-" + stack.stage, {
    value: site.url || localhost + "3009",
    exportName: "driverSiteUrl-" + stack.stage, // export name
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
