import { Bucket, StackContext } from "sst/constructs";

import * as kms from "aws-cdk-lib/aws-kms";
import * as iam from "aws-cdk-lib/aws-iam";
import { AnyPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
const pathToLambdas = "packages/admin-backend/lambdas/";

export function orgResources({ stack }: StackContext) {
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

  const s3Bucket = new Bucket(stack, "imagesPucket", {
    cors: [
      {
        allowedMethods: ["GET", "HEAD", "PUT", "POST"],
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
      },
    ],
  });
  const authBucket = new Bucket(stack, "authBucket", {});

  const bucketPolicy = new PolicyStatement({
    actions: ["s3:GetObject", "s3:PutObject"],
    resources: [`${s3Bucket.bucketArn}/*`],
    principals: [new AnyPrincipal()],
  });

  s3Bucket.cdk.bucket.addToResourcePolicy(bucketPolicy);
  s3Bucket.addNotifications(stack, {
    resizeFunction: {
      function:
        "packages/Store-backend/lambdas/imageResizeTrigger/imageResizeTrigger.handler",
      events: ["object_created_put"],
      filters: [{ prefix: "initial/" }],
    },
  });
  stack.addOutputs({
    bucketUrl: s3Bucket.bucketName,
  });
  return {
    authBucket,
    s3Bucket,
    key,
  };
}
