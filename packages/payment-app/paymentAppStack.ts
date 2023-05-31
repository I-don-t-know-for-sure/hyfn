import { StackContext, StaticSite } from "sst/constructs";
import { getStage } from "../../stacks";
import { frConfig } from "../../frEnvVaraibles";
import { CfnOutput } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { AnyPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

const localhost = "http://localhost:";

export function paymentApp({ stack }: StackContext) {
  const stage = getStage(stack.stage);
  // const bucketPolicy = new PolicyStatement({
  //   actions: ["s3:GetObject", "s3:PutObject"],
  //   resources: [`arn:aws:s3:::${"paymentBucket-" + stack.stage}/*`],
  //   principals: [new AnyPrincipal()],
  //   effect: Effect.ALLOW,
  // });
  const site = new StaticSite(stack, "payment-app", {
    path: "./",
    buildOutput: "dist",
    buildCommand: "yarn build",
    cdk: {
      bucket: {
        // bucketName: "payment-bucket-" + stack.stage,
        // cors: [
        //   {
        //     allowedMethods: [s3.HttpMethods.GET],
        //     allowedOrigins: ["*"],
        //     allowedHeaders: ["*"],
        //   }],
        // publicReadAccess: true,
        // blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
        // accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      },
    },
    ...(stack.stage === "production"
      ? {
          customDomain: {
            domainName: "pay.hyfn.xyz",
            domainAlias: "www.pay.hyfn.xyz",
            hostedZone: "hyfn.xyz",
            // isExternalDomain: true,
          },
        }
      : {}),
    environment: {
      VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL:
        frConfig[stage].MOAMALAT_PAYMEN_GATEWAY_URL,
    },
  });
  new CfnOutput(stack, "paymentAppUrl-" + stack.stage, {
    value: site.url || localhost + "3002",
    exportName: "paymentAppUrl-" + stack.stage, // export name
  });
  stack.addOutputs({
    managmentSite: site.url || localhost + "3002",
  });
  return {
    site,
  };
}
