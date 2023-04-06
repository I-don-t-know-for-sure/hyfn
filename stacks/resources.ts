import { Bucket, StackContext } from "sst/constructs";

import * as kms from "aws-cdk-lib/aws-kms";
import * as iam from "aws-cdk-lib/aws-iam";
import { AnyPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnOutput } from "aws-cdk-lib";
const pathToLambdas = "packages/admin-backend/lambdas/";

export function imagesBucketStack({ stack }: StackContext) {
  const s3Bucket = new Bucket(stack, "imagesBucket", {
    cors: [
      {
        allowedMethods: ["GET", "HEAD", "PUT", "POST"],
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
      },
    ],
  });

  const bucketPolicy = new PolicyStatement({
    actions: ["s3:GetObject", "s3:PutObject"],
    resources: [`${s3Bucket.bucketArn}/*`],
    principals: [new AnyPrincipal()],
  });

  s3Bucket.cdk.bucket.addToResourcePolicy(bucketPolicy);
  s3Bucket.addNotifications(stack, {
    resizeFunction: {
      function:
        "./packages/Store-backend/lambdas/imageResizeTrigger/imageResizeTrigger.handler",
      events: ["object_created_put"],
      filters: [{ prefix: "initial/" }],
    },
  });

  new CfnOutput(stack, "imagesBucket-" + stack.stage, {
    value: s3Bucket.bucketName,
    exportName: "imagesBucket-" + stack.stage, // export name
  });
  stack.addOutputs({
    bucketUrl: s3Bucket.bucketName,
  });
  return {
    s3Bucket,
  };
}

export function authBucketStack({ stack }: StackContext) {
  const authBucket = new Bucket(stack, "authBucket", {});
  new CfnOutput(stack, "authBucketName-" + stack.stage, {
    value: authBucket.bucketName || "",
    exportName: "authBucketName-" + stack.stage, // export name
  });
  new CfnOutput(stack, "authBucketArn-" + stack.stage, {
    value: authBucket.bucketArn || "",
    exportName: "authBucketArn-" + stack.stage, // export name
  });
  return {
    authBucket,
  };
}
export function kmsStack({ stack }: StackContext) {
  const key = new kms.Key(stack, "secretsKeyHyfn", {
    // alias: "secretesKeyhyfn",
    enableKeyRotation: true,
  });

  const policyStatement = new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:Describe*",
    ],
    principals: [new AnyPrincipal()],
    resources: ["*"],
  });

  key.addToResourcePolicy(policyStatement);
  new CfnOutput(stack, "secretesKmsKey-" + stack.stage, {
    value: key.keyArn,
    exportName: "secretesKmsKey-" + stack.stage, // export name
  });
  return {
    key,
  };
}
