import { Cognito, StackContext, StaticSite, use } from "sst/constructs";
import { getStage } from "../../stacks/getStage";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnOutput, Fn } from "aws-cdk-lib";
import { frConfig } from "../../frEnvVaraibles";

const localhost = "http://localhost:";

export function libraryApp({ stack }: StackContext) {
  const stage = getStage(stack.stage);
  // const { auth } = use(libraryCognitoStack);
  // const { api } = use(libraryApiStack);
  const s3BucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const paymentAppUrl = Fn.importValue(`paymentAppUrl-${stack.stage}`);
  // const cognitoIdentityPoolId = Fn.importValue(
  //   `libraryCognitoIdentityPoolId-${stack.stage}`
  // );
  // const cognitoRegion = Fn.importValue(`libraryCognitoRegion-${stack.stage}`);
  // const cognitoUserPoolId = Fn.importValue(`libraryUserPoolId-${stack.stage}`);
  // const cognitoUserPoolClientId = Fn.importValue(
  //   `libraryUserPoolClientId-${stack.stage}`
  // );
  const authBucketName = Fn.importValue(`authBucketName-${stack.stage}`);
  // const url = Fn.importValue(`libraryApiUrl-${stack.stage}`);
  const site = new StaticSite(stack, "products-library", {
    path: "./",
    buildOutput: "dist",
    buildCommand: "yarn build",

    ...(stack.stage === "production"
      ? {
          customDomain: {
            domainName: "products.hyfn.xyz",
            domainAlias: "www.products.hyfn.xyz",
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
        Fn.importValue(`libraryCognitoIdentityPoolId-${stack.stage}`) || "",
      VITE_APP_COGNITO_REGION: stack.region,
      VITE_APP_USER_POOL_ID: Fn.importValue(`libraryUserPoolId-${stack.stage}`),
      VITE_APP_USER_POOL_CLIENT_ID: Fn.importValue(
        `libraryUserPoolClientId-${stack.stage}`
      ),
      VITE_APP_BUCKET: authBucketName,

      // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=

      VITE_APP_BASE_URL: Fn.importValue(`libraryApiUrl-${stack.stage}`),
    },
  });

  new CfnOutput(stack, "librarySiteUrl-" + stack.stage, {
    value: site.url || localhost + "4005",
    exportName: "librarySiteUrl-" + stack.stage, // export name
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
